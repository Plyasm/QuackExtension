import { lib, game, ui, get, ai, _status } from "../../noname.js";

const skills = {
    //ys_维多利亚
    "ys_yancong": { //严从
        group: ["ys_yancong_chusha", "ys_yancong_damage", "ys_yancong_count"], //三个部分，一个视为出杀，一个负责处理没造成伤害后，一个负责记录已经对谁发动过技能
        subSkill:{
            'chusha':{ //代码参考[zuoding]佐定, [reqianxi]潜袭, [gongshen]工神, [nifu]匿伏, [heji]合击, [junchi]骏驰
                trigger: {
                    global: "useCardAfter", //有角色使用牌结算完毕后
                },
                check: function (event, player){
                    var targets = event.targets;
                    //for (var i = 0; i < targets.length; i++){
                        //game.print("维夏对" + targets[i].name + "态度为： " + get.attitude(player, targets[i]).toString());
                    //}
                    if (!(targets.some(target => get.attitude(player, target) < -1))) return false; //如果没有敌对目标不发动
                    var haveshan = [];
                    var takenodamage = [];
                    var notenemy = [];
                    for (var i = 0; i < targets.length; i++){
                        if (targets[i].mayHaveShan(player, "use", targets[i].getCards("h", i => {return i.hasGaintag('sha_notshan');}))){
                            haveshan.push(targets[i]);
                        }else if (!(get.attitude(player, targets[i] < 0))){
                            notenemy.push(targets[i]);
                        }else if (targets[i].hasSkillTag("nodamage")){
                            takenodamage.push(targets[i]);
                        }
                    }
                    if (!targets.some(target => !haveshan.includes(target) && !notenemy.includes(target)) && player.hp <= 2 && player.countCards('h', "tao") == 0) return false; //残血时，如果没目标没有闪且是敌人则不发动
                    if (targets == takenodamage && player.hp <= 2) return false; //如果对方全部免疫伤害且自己残血不发动
                    if (event.targets.length * 2 > player.countCards("he")) return false; //如果要弃的牌过多则不发动
                    return true;
                },
                skillAnimation: 'true',
                prompt: '是否发动【严从】，弃置目标数张牌并视为对其中一名目标角色使用一张无视距离的【杀】？',
                filter: function(event, player) {
                    if (!player.storage.ys_yancong_count) player.storage.ys_yancong_count = []; //初始化已发动过技能记录
                    return event.player != player && //其他角色
                    (event.card.name == 'sha' || get.type(event.card) == 'trick') && //使用杀或锦囊牌
                    event.targets && //有目标
                    event.targets.length > 0 && //目标至少为一人
                    event.targets.some(target => !target.isDead() && target.isIn() && target != player && !player.storage.ys_yancong_count.includes(target)) && //目标中有活着的其他角色且不是自己且没有发动过技能
                    player.countCards('he') >= event.targets.length; //自己有足够多的牌来弃置
                },
                content: async function(event, trigger, player) {
                    //game.print('严从触发啦！') //测试用
                    let targetamount = get.event().getTrigger().targets.length; //目标数
                    await player.chooseToDiscard(targetamount, 'he', '请弃置' + get.cnNumber(targetamount, true) + '张牌', true).forResult(); //选择一张牌弃置（强制）
                    let target = await player.chooseTarget(true, '请选择其中一名目标角色，视为对其使用一张无视距离的【杀】', function (card, player, target){ //选择目标（强制）
                        return target != player && get.event().getTrigger().targets.includes(target) && target.isIn() && !(player.storage.ys_yancong_count.includes(target)); //只能选择目标角色中的一个，且不能是自己，且不能是已经发动过技能的角色
                    }).set("ai", target => {      //bookmark: not done
                        var att = get.attitude(player, target);
                        //game.print("维夏对" + target.name + "态度为： " + att.toString());
                        if (target.mayHaveShan(player, "use", i => {return i.hasGaintag("sha_notshan");}) && target.hasJudge("lebu") && att > 1 && !(player.hp <= 2 && player.countCards("h", "tao") == 0)){ //如果是队友且估计有闪且被乐了且自己卖的了这个血
                            return 100; //发动，帮忙搞乐不思蜀
                        }
                        if (att > 1) return 0.01; //不然绝对不对队友发动
                        if (target.hasSkillTag("nodamage") && player.hp <= 2) return att * 0.01; //如果对方免疫伤害且自己残血不发动
                        if (target.hasSkillTag("filterDamage") && player.hp <=2) att *= 0.7; //如果对方有减伤且自己残血，不倾向于发动
                        if (att < 0){ //如果是敌对关系，则进入进一步判断
                            if (target.countCards("h") >= 2  && target.mayHaveShan(player, "use", target.getCards("h", i => {return i.hasGaintag("sha_notshan");}))) att *= 0.5; //如果对方有至少两张手牌且有可能有闪则不倾向于发动
                            if (target.countCards("he") == 0) att *= 1.5; //如果对方没有装备和手牌，倾向于发动
                            else if (target.countCards("h") == 0) att *= 1.25; //如果只是没有手牌，倾向少一点
                            if (target.hp <= 2) att *= 1.5; //如果对方残血则倾向于发动
                            if (target.hasSkillTag("maixie_defend")) att *= 0.8; //如果对方有卖血或者防御技不倾向于发动
                            return -att;
                        } else if (att > 0 && att < 1){ //比较模糊的立场
                            return att;
                        }
                    }).forResult(); //选择一名角色
                    if (target.bool){
                        let skillTarget = target.targets[0];
                        player.storage.chusha = true; //记录出杀
                        await player.useCard({name: 'sha'}, skillTarget, false); //视为对角色使用一张无视距离的【杀】
                        player.storage.ys_yancong_count.push(skillTarget); //记录已发动过技能的角色
                    }
                },
                sub: true,
                sourceSkill: 'ys_yancong',
                ai: {
                    expose: 0.5,
                    threaten: 2.5,
                }
            },
            'damage':{ //代码参考[huanxia]幻霞
                trigger: {
                    player: 'shaUnhirt', //使用杀并且未造成伤害时
                },
                forced: true,
                content: async function(event, trigger, player) {
                    //game.print('正在检查此杀') //测试用           (这里有很大的问题，检测是不是严从出的杀不对劲)
                    if (player.storage.chusha){ //如果是严从出的杀
                        //game.print('这杀是严从出的！') //测试用
                        player.storage.chusha = false; //重置出杀记录
                        //game.print('这杀没有造成伤害！') //测试用
                        //game.print('处理严从未造成伤害中！') //测试用
                        await player.damage(1, 'nosource'); //受到一点无来源伤害
                        await player.gainPlayerCard(trigger.target, 'hej', true); //获得目标角色区域内的一张牌
                    }
                    else{
                        //game.print('这杀不是严从出的！') //测试用
                    }
                },
                sub: true,
                sourceSkill: 'ys_yancong',
            },
            'count':{
                trigger: {
                    global: "phaseAfter", //回合结束后
                },
                priority: 10,
                forced: true,
                content: async function(event, trigger, player) {
                    if (player.storage.ys_yancong_count) delete player.storage.ys_yancong_count; //清除已发动过技能记录
                },
                popup: false,
                nopop: true,
                sub: true,
                sourceSkill: 'ys_yancong',
            },
        }
    },
    "ys_shanzhan": {
        frequent: true,
        trigger: {
            player: [ //当你
                'useCard', //使用卡牌
                'respond', //打出卡牌
                'damageEnd' //受到伤害后
            ]
        },
        filter: function(event, player) {
            if (event.name == 'damage'){
                return true;
            }
            else if (event.name == 'useCard' || event.name == 'respond'){
                return event.card.name == 'sha'; //使用或打出的是【杀】
            }
        },
        content: async function(event, trigger, player) {
            //game.print('善战触发啦！') //测试用
            await player.draw();
        },
        ai: {
            tag: {
                gain: 1,
                maixie: true,
            }
        }
    },
    "ys_qiangshi": {
        charlotte: true,
        group:["ys_qiangshi_recover", "ys_qiangshi_tao", "ys_qiangshi_count", "ys_qiangshi_round"],
        subSkill:{
            'recover':{
                trigger: {
                    player: "recoverBegin", //当你回复体力时
                },
                //filter: function(event, player) {
                //    return true; //调试所用
                //},
                forced: true,
                content: async function(event, trigger, player) {
                    if (player.countCards('h') > 0){ //如果有手牌
                        await player.chooseToDiscard('h', '请弃置一张手牌', true); //选择并弃置一张手牌（强制）
                    }
                    trigger.num++; //此次回复值+1
                },
                sub: true,
                sourceSkill: 'ys_qiangshi',
                ai: {
                    tag: {
                        recover: 0.5,
                        halfneg: true,
                        noh: true,
                    }
                }
            },
            'tao':{ //代码参考[jielie]节烈
                trigger: {
                    global: "phaseEnd", //一名角色的回合结束时
                },
                round: 1, //每轮限一次
                forced: true,
                skillAnimation: true,
                filter: function(event, player) {
                    if (!(player.storage.qiangshi >= player.hp)) return false; //本回合弃置的牌数不少于你的体力值
                    for (var i = 0; i < ui.discardPile.childElementCount; i++){ //遍历弃牌堆,检查是否有【桃】
                        if (ui.discardPile.childNodes[i].name == 'tao') return true; //弃牌堆里有【桃】
                    }
                    return false; //弃牌堆里没有【桃】
                },
                content: async function(event, trigger, player) {
                    await player.addTempSkill('ys_qiangshi_round', "roundStart"); //标记本轮已发动【强食】
                    let tao = get.discardPile(function(card){return card.name == 'tao'}, 'random'); //从弃牌堆中随机获得一张【桃】
                    await player.gain(tao, 'gain2'); //获得这张【桃】
                },
                sub: true,
                sourceSkill: 'ys_qiangshi',
                ai: {
                    tag: {
                        gain: 0.2,
                    }
                }
            },
            'count':{
                trigger: {
                    player: "discardAfter", //弃牌后
                    global: 'phaseAfter', //一名角色的回合结束后
                },
                forced: true,
                content: async function(event, trigger, player) {
                    if (trigger.name == 'discard'){ //如果是弃牌后
                        if (!player.storage.qiangshi) player.storage.qiangshi = 0; //初始化弃牌数
                        player.storage.qiangshi += trigger.cards.length; //记录弃牌数
                        //game.print('记录弃牌数为' + player.storage.qiangshi); //测试用
                    }
                    else if (trigger.name == 'phase'){ //如果是回合结束后
                        if (player.storage.qiangshi) delete player.storage.qiangshi; //清除弃牌数
                    }
                },
                popup: false,
                nopop: true,
                sub: true,
                sourceSkill: 'ys_qiangshi',
            },
            'round':{ //参考 [shiming]识命
                mark: true,
                marktext: '食',
                intro: {
                    name: '强食',
                    content: '本轮已发动【强食】',
                },
                onremove: true,
                popup: false,
                nopop: true,
                sub: true,
                sourceSkill: 'ys_qiangshi',
            },
        },
    },
    //代号杀萧何
    "dhs_chengye": { //成也：回合结束时，你可以令一名其他角色立即进行一个出牌阶段，且此阶段其使用牌时，其摸一张牌。
        audio: "ext:鸭子扩展/audio/skill:2",
        trigger: {
            player: "phaseEnd",
        },
        check: function(event, player){ //检查是否该发动技能
            if (game.players.length > 2 && game.players.some(wanjia => get.attitude(player, wanjia) > 1 && wanjia != player)){ //游戏人数超过2人且对至少一名其他人有好态度时
                return true;
            }else return false;
        },
        content: async function(event, trigger, player) {
            let target = await player.chooseTarget(true, '请选择一名其他角色，其立即进行一个出牌阶段，且此阶段使用牌后摸一张牌', function (card, player, target){
                return target != player; //选择一名其他角色
            }).set("ai", target => {
                var player = event.player,
                att = get.attitude(player, target);
                //game.print("萧何对" + target.name + "态度为： " + att.toString());
                if (att <= 1) return att;
                if (target.hasSkillTag("nogain")) return 0.01 * att;
                if (target.hasJudge("lebu")) att *= 1.25;
                if (target.countCards("h") > target.hp) att *= 1.10;
                if (get.attitude(player, target) > 3) {
                    var basis = get.threaten(target) * att;
                    if (target.countCards("h") < target.hp) return basis * 0.8;
                    //game.print(("萧何对" + target.name + "判断为： " + basis.toString()));
                    return basis;
                } else return att;
            }).forResult();
            if (target.bool){
                let skillTarget = target.targets[0];
                player.logSkill('dhs_chengye', skillTarget);
                skillTarget.addTempSkill("dhs_chengyedraw", "phaseUseEnd") //让其获得用一张摸一张的暂时技能
                var next = skillTarget.insertPhase(); //其立即进行一个额外回合
                next._noTurnOver = true; //
                next.phaseList = ["phaseUse"]; //里面只有出牌阶段
            }
        },
        ai: {
            expose: 0.5,
            threaten: 3,
        }
    }, 
    "dhs_chengyedraw":{ //用一张牌，摸一张牌
        mark: true,
        marktext: "成",
        audio: "ext:鸭子扩展/audio/skill:2",
        trigger: {
            player: "useCard" //使用牌时
        },
        intro: {
            name: "成也",
            content: "使用牌时摸一张牌"
        },
        forced: true,
        nopop: true,
        popup: false,
        content: async function(event, trigger, player){
            player.logSkill('dhs_chengyedraw');
            await player.draw(); //摸一张牌
        },
        sub: true,
        sourceSkill: 'dhs_chengye'
    },
    "dhs_baiye": { //参考张邈的[mouni]谋逆
        //败也：限定技，其他角色出牌阶段结束时，若其在此阶段内使用过的牌数大于三张，你可以令一名除其以外的其他角色对其依次使用手牌中的所有【杀】，直到其进入濒死状态
        //[dczuojian]佐谏
        trigger: {
            global: "phaseUseEnd", //一名角色出牌阶段结束时
        },
        audio: "ext:鸭子扩展/audio/skill:2",
        unique: true,
        limited: true,
        skillAnimation: true,
        animationColor: 'fire',
        check: function(event, player){ //检查是否该发动技能
            var enemy = event.player,
            att = get.attitude(player, enemy);
            game.print("萧何对" + enemy.name + "态度为： " + att.toString());
            if (att > 1) return false; //队友或不相干的人，不发动
            if (enemy.hasSkillTag("nodamage")) return false; //如果对方免疫伤害不发动
            if (enemy.hasSkillTag("filterDamage")) att *= 0.5 //如果对方有减伤，不倾向于发动
            if (enemy.countCards("he") == 0) att *= 1.5; //如果对方没有装备和手牌，倾向于发动
            if (att < 0){ //如果是敌对关系，则进入进一步判断
                var basis = get.threaten(enemy) * att; //根据对方的威胁度判断
                if (enemy.countCards("h") >= 2  && enemy.mayHaveShan(player, "use", enemy.getCards("h", i => {return i.hasGaintag("sha_notshan");}))) basis *= 0.5; //如果对方有至少两张手牌且有可能有闪则不倾向于发动
                if (enemy.hp <= 2) basis *= 1.5; //如果对方残血则倾向于发动
                if (basis <= -12){
                    if (game.players.some(other => get.attitude(player, other) < 1 || (get.attitude(player, other) > 1 && other != player))) { //确保有其他对其有明确态度的人，不乱发动
                        return true; //超过一定的数值，发动
                    }
                    else return false;
                }
                else return false; //没有达到标准，不发动
            } else return false; //如果不是敌对关系，不发动
        },
        filter: function(event, player) {
            return event.player.getHistory('useCard', function(evt){ //获取使用过的牌
                var evtx = evt.getParent('phaseUse'); //获取使用牌的阶段,确保是在出牌阶段使用的牌
                if (evtx && evtx == event) return true; //是在此阶段使用的牌
                return false;}).length > 3 && //在此阶段内使用过的牌数大于三张
            player != event.player && //不是自己
            game.countPlayer() >= 3 && //场上至少存活三人
            !player.storage.dhs_baiye; //没有发动过技能
        },
        content: async function(event, trigger, player) {
            //game.print("发动败也") //测试用
            player.awakenSkill('dhs_baiye'); //标记已发动技能
            let target = await player.chooseTarget(true, '请选择一名除前回合角色以外的其他角色，令其对当前回合角色依次使用手牌中的所有【杀】，直到其进入濒死状态', function (card, player, target){
                return target != player && target != _status.currentPhase && target.isIn() && !target.isDead(); //选择一名除其以外的其他角色 且活着 在场上
                }).set("ai", target => {
                    var victim = _status.event.player,
                    att = get.attitude(player, target),
                    targetatt = get.attitude(target, victim);
                    //game.print(("萧何对" + target.name + "判断为： " + att.toString()));
                    if (target.countCards('h') <= 1) return 0; //没手牌的人不要用
                    if (targetatt > 1) att *= 1.2; //如果目标和受害者是队友则倾向于对他发动
                    if (targetatt < -1) att *= 0.8; //尽量不与受害者敌对阵营发动
                    if (att < -1){ //如果玩家与目标是敌人
                        var basis = get.threaten(target) * att; //按照威胁度调整判断
                        if  (target.countCards("h") < target.hp) basis *= 0.8; //如果目标牌比较少不倾向于选他
                        if (target.mayHaveSha(player, "use", null, "count") >= 3) basis *= 1.2; //如果目标杀比较多倾向于选他
                        return -basis;
                    } else {
                        var basis = get.threaten(target) * att;
                        if  (target.countCards("h") < target.hp) basis *= 0.8;
                        if (target.mayHaveSha(player, "use", null, "count") >= 3) basis *= 1.2;
                        return basis*= 0.8; //不是与目标敌人的话就尽量不选他
                    }
                }).forResult();
            if (target.bool){
                let victim = _status.currentPhase;
                event.target = victim;
                //event.player = murderer;
                let murderer = target.targets[0];
                player.logSkill('dhs_baiye', murderer);
                murderer.addSkill('dhs_baiyedyingcheck'); //添加技能,检查濒死状态
                let cards = murderer.getCards('h', 'sha'); //取技能发动对象所有杀
                //let dhs_baiye_dying = false;
                while (!victim.isDead() && (!victim.hasSkill("dhs_baiye3"))) { //只要目标没进入濒死
                    if (cards.length){
                        let card = cards.randomRemove(1)[0];
                        await murderer.useCard(victim, false, card); //强迫技能发动对象对目标使用所有杀
                    }
                    else break;
                }
                murderer.removeSkill("dhs_baiyedyingcheck")
            }
        },
        ai: {
            expose: 1,
            threaten: 2,
        }
    },
    'dhs_baiyedyingcheck': {
        trigger: {
            global: "dying", //一名角色进入濒死状态时
        },
        forced: true,
        firstDo: true,
        filter: function(event, player) {
            //game.print(event.getParent("dhs_baiye").player.name);
            //game.print(event.getParent("dhs_baiye").target.name);
            //game.print(event.player.name);
            var evt = event.getParent('dhs_baiye'); 
            return evt && evt.player.name == "dhs_xiaohe" && evt.target == event.player;
           //return event.getParent().name == "dhs_baiye";
            //game.print(event.getParent("dhs_baiye").name)
            //return _status.event.skill == "dhs_baiye"
        },
        content: async function(event, trigger, player) {
            //game.print("角色因为败也进入濒死状态啦！")
            trigger.player.addTempSkill("dhs_baiyedying", 'phaseEnd');
            //trigger.getParent('dhs_baiye').dhs_baiye_dying = true;
        },
        popup: false,
        nopop: true,
        sub: true,
        sourceSkill: 'dhs_baiye',
    }, 
    'dhs_baiyedying': {
        sub:true,
        popup: false,
        nopop: true,
        sourceSkill: 'dhs_baiye',
    },
    //代号杀左慈
    // 'dhs_zhibeixicao': {//掷杯戏曹：你使用牌指定其他角色为唯一目标时，可以额外指定1个虚假目标，该目标可以响应此牌（无效果）。
    //     sub:true,
    //     popup: false,
    //     nopop: true,
    //     sourceSkill: 'dhs_baiye',
    // },
    // 'dhs_dunjiatianshu': {// 遁甲天书：你的回合开始前，你从三名随机武将中选择一名，你获得其所有技能直到你的下回合开始。
    //     init: init(player) {
    //         if (!player.storage.huashen) {
    //             player.storage.huashen = { owned: {}, choosed: [] };
    //         }
    //     },
    //     addHuashen: addHuashen(player) {
    //         if (!player.storage.huashen) return;
    //         if (!_status.characterlist) {
    //             lib.skill.pingjian.initList();
    //         }
    //         _status.characterlist.randomSort();
    //         for (let i = 0; i < _status.characterlist.length; i++) {
    //             let name = _status.characterlist[i];
    //             if (name.indexOf("zuoci") != -1 || name.indexOf("key_") == 0 || name.indexOf("sp_key_") == 0 || player.storage.huashen.owned[name]) continue;
    //             let skills = lib.character[name][3];
    //             if (skills.length) {
    //                 player.storage.huashen.owned[name] = skills;
    //                 _status.characterlist.remove(name);
    //                 return name;
    //             }
    //         }
    //     },
    //     addHuashens: function(player, num) {
    //         var list = [];
    //         for (var i = 0; i < num; i++) {
    //           var name = lib.skill.huashen.addHuashen(player);
    //           if (name) list.push(name);
    //         }
    //         for (var i = 0; i < list.length; i++) {
    //           var j = i + 1;
    //           if (game.me == player) {
    //             // setTimeout(function () {
    //             var wjtp = ui.create.div('.zuociwujiangtupian', player);
    //             if (list.length % 2 == 0) wjtp.style.left = (j - (list.length / 2)) * 80 - 520 + "px";
    //             else wjtp.style.left = (j - ((list.length - 1) / 2)) * 80 - 560 + "px";
    //             wjtp.style.backgroundImage = 'url("' + lib.assetURL + "image/character/" + list[i] + '.jpg' + '")';
    //             // },600*i);
    //           } else {
    //             var wjtp = ui.create.div('.aizuociwujiangtupian', player);
    //             if (list.length % 2 == 0) wjtp.style.left = (j - (list.length / 2)) * 60 - 15 + "px";
    //             else wjtp.style.left = (j - ((list.length - 1) / 2)) * 60 - 35 + "px";
    //           }
    //         }
      
    //         if (list.length) {
    //           game.log(player, '获得了', get.cnNumber(list.length) + '张', '#g化身')
    //           lib.skill.rehuashen.drawCharacter(player, list);
    //         }
    //     },
    //     trigger: {
    //         player: "phaseBegin",
    //         global: "phaseBefore",
    //     },
    //     filter: function(event, player){
    //         if (event.name != "phase") return true;
    //         if (name == "phaseBefore") return game.phaseNumber == 0;
    //         return !get.is.empty(player.storage.huashen.owned);
    //     },
    //     content: async function(event, trigger, player){

    //     }
    // },
    'dhs_feishengtaixu': {// 飞升太虚：游戏开始或回合开始时，你依次亮出牌顶的两张牌，你的体力值与手牌上限变为牌的点数。
        trigger : {
            player: ['enterGame', 'phaseBegin'],
        },
        forced: true,
        content: async function(event, trigger, player){
            var card1 = get.cards(2, false)[0]
        }
    }
};

export default skills;