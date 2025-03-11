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
                    }).set("ai", target => {
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
                forced: true,
                skillAnimation: true,
                filter: function(event, player) {
                    if (player.hasSkill("ys_qiangshi_round")) return false; //本轮没法动过强食
                    if (!(player.storage.qiangshi >= player.hp)) return false; //本回合弃置的牌数不少于你的体力值
                    for (var i = 0; i < ui.discardPile.childElementCount; i++){ //遍历弃牌堆,检查是否有【桃】
                        if (ui.discardPile.childNodes[i].name == 'tao') return true; //弃牌堆里有【桃】
                    }
                    return false; //弃牌堆里没有【桃】
                },
                content: async function(event, trigger, player) {
                    await player.addSkill('ys_qiangshi_round'); //标记本轮已发动【强食】
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
                trigger: {
                    global: "roundStart",
                },
                content: async function(event, trigger, player){
                    await player.removeSkill("ys_qiangshi_round");
                },
                forced: true,
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
                player.line(skillTarget, 'red');
                game.log(player, '对', skillTarget, "发动了",  "【" + get.translation("dhs_chengye") + "】");
                skillTarget.addTempSkill("dhs_chengyedraw", "phaseUseEnd"); //让其获得用一张摸一张的暂时技能
                var next = skillTarget.insertPhase(); //其立即进行一个额外回合
                next._noTurnOver = true; //
                next.phaseList = ["phaseUse"]; //里面只有出牌阶段
            }
        },
        ai: {
            expose: 0.5,
            threaten: 3,
        },
        mod: {
            maxHandcardBase: function(player, num) {
                return 5;
            },
        },
        derivation: 'dhs_chengyedraw',
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
        content: async function(event, trigger, player){
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
                player.line(murderer, 'red');
                game.log(player, '对', murderer, "发动了", "【" + get.translation("dhs_baiye") + "】");
                murderer.addSkill('dhs_baiyedyingcheck'); //添加技能,检查濒死状态
                //let dhs_baiye_dying = false;
                while (!victim.isDead() && (!victim.hasSkill("dhs_baiyedying"))) { //只要目标没进入濒死
                    if (murderer.getCards("h", 'sha').length){
                        let card = murderer.getCards('h', 'sha').randomRemove(1)[0];
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
    'dhs_zhibeixicao': {//掷杯戏曹：你使用牌指定其他角色为唯一目标时，可以隐藏你的目标，并额外指定1个虚假目标。该目标可以响应此牌（此牌对其无效果）。
        //参考[olchenglie_effect]骋烈
        //全部重写
        // trigger: {
        //     player: "useCardToPlayer", //使用牌指定角色时
        // },
        // direct: true, //不普通询问发不发动
        // filter: function(event, player){ //指定其他角色为唯一目标时
        //     if (event.target != player && event.targets && event.targets.length == 1){
        //         return game.hasPlayer(function (current) {
        //             return !event.targets.includes(current) && player.canUse(event.card, current); //必须有其他符合成为目标的角色
        //         });
        //     }
        //     return false;
        // },
        // content: async function(event, trigger, player){
        //     let target = await player.chooseTarget(get.prompt("dhs_zhibeixxicao"), "发动【掷杯戏曹】，为" + get.translation(trigger.card) + "多指定一个目标", (card, player, target) => {
        //         var evt = _status.event.getTrigger();
        //         return !evt.targets.includes(target) && player.canUse(evt.card, target);
        //     })
        //     .set('ai', target => {
        //         var player = _status.event.player;
        //         var evt = _status.event.getTrigger();
        //         return get.effect(target, evt.card, player, player);
        //     }).forResult();
        //     if (target.bool){
        //         trigger.targets.addArray(target.targets);
        //         player.storage.dhs_zhibeixicao = target.targets;
        //     }
        // },
        // subSkill: {//参考[twjuexing]绝行 [dulie]笃烈
        //     effect: {
        //         trigger: {
        //             global: ["chooseToUseAfter", "chooseToRespondAfter"],
        //         },
        //         forced: true,
        //         popup: false,
        //         charlotte: true,
        //         filter: function(event, player){
        //             return event.getParent(2).name == "dhs_zhibeixicao" && player.storage.dhs_zhibeixicao && event.player == player.storage.dhs_zhibeixicao[0];
        //         },
        //         content: async function(event, trigger, player){
        //             trigger.targets.remove(event.player);
        //             trigger.getParent().triggeredTargets2.remove(event.player);
        //             trigger.untrigger();
        //         },
        //         sub: true,
        //         sourceSkill: "dhs_zhibeixicao",
        //     }
        // }
        //
        //参考[dcsbpingliao]平辽
        trigger: {
            player: "useCard",
        },
        filter: function(event, player){
            if (event.target != player && event.targets && event.targets.length == 1){
                return game.hasPlayer(function (current) {
                    return !event.targets.includes(current) && player.canUse(event.card, current); //必须有其他符合成为目标的角色
                });
            }
            return false;
        },
        logTarget: async function(event, player){
            let target = await player.chooseTarget("是否发动【掷杯戏曹】，为" + get.translation(this.trigger.card) + "增加一个虚拟目标？", (card, player, target) => {
                var evt = _status.event.getTrigger();
                return !evt.targets.includes(target) && player.canUse(evt.card, target);
            })
            .set('ai', target => {
                var player = _status.event.player;
                var evt = _status.event.getTrigger();
                return get.effect(target, evt.card, player, player);
            }).forResult();
            if (target.bool){
                var mixedTarget = [];
                mixedTarget.addArray(this.trigger.targets);
                mixedTarget.addArray(target.targets);
                player.storage.dhs_zhibeixicao_real = target.targets;
                player.storage.dhs_zhibeixicao_all = mixedTarget;
            }
            return mixedTarget;
        },
        content: async function (event, trigger, player){
            const targets = game.filterPlayer().sortBySeat();
            const respondedTargets = [];
            const prompt = `###是否使用或打出牌来响应或抵消${get.translation(player)}对你使用的牌?###${get.translation(player)}对你使用了一张不知真假的${get.translation(trigger.card)}。若你是虚假目标，此牌生效后对你无效果。`;
            for (let target of targets){
                if (player.storage.dhs_zhibeixicao_all.includes(target)){
                    const result = await target.chooseToRespond(prompt, (card, player) => {
                        //可能最优解就是每个卡牌都弄个if bookmark：没做完
                        //如果真目标没响应，直接结算，不让响应牌本身
                        //如果真目标响应了，细分（决斗单独）
                        //记虚假目标，然后子技能，对他使用牌且其未响应的时候，无效牌
                        if (trigger.shaRequired()){
                            return card == "sha" || card == "wuxie";
                        }else if (trigger.shanRequired()){
                            if (trigger.card != "sha"){
                                return card == "shan";
                            }else return card == "shan" || card == "wuxie";
                        }else if (trigger.card = "sha"){
                            
                        }
                        else return card == "wuxie";
                    }).set("ai", card => {

                    })
                    .set("respondedTargets", respondedTargets)
                    .forResult();
                    if (result.bool){
                        respondedTargets.push(target);
                        await game.delay();
                        if (trigger.targets.includes(target)) {
                            target.respond();
                        }
                    }
                }
            }
        }
    },
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
        audio: "ext:鸭子扩展/audio/skill:2",
        trigger : { //参考[gwchuanxin]穿心, [zaiqixx]再起, [jsrgshacheng]沙城
            player: 'phaseBegin',
        },
        charlotte: true,
        forced: true,
        group: "dhs_feishengtaixu_start",
        content: async function(event, trigger, player){
            event.cards = get.cards(2);
            await game.cardsGotoOrdering(event.cards);
            await player.showCards(event.cards[0], "【飞升太虚】");
            //event.cards[0].number.toString()
            var difference = player.maxHp - event.cards[0].number;
            var differencecurrent = player.hp - event.cards[0].number;
            if (differencecurrent > 0){
                await player.loseMaxHp(difference);
            }
            else {
                if (difference < 0){
                    await player.gainMaxHp(-difference);
                    await player.recover(-differencecurrent);
                }
                else{
                    await player.loseMaxHp(difference);
                    await player.recover(-differencecurrent);
                }
            }
            await player.showCards(event.cards[1], "【飞升太虚】");
            //player.removeSkill("dhs_feishengtaixu2");
            player.storage.dhs_feishengtaixu = event.cards[1].number;
            //player.addSkill("dhs_feishengtaixu2");
        },
        mod: {
            maxHandcard: function(player, num) {
                return player.storage.dhs_feishengtaixu;
            },
        },
        subSkill: {
            start: {
                audio: ["dhs_feishengtaixu", 2],
                trigger: {
                    global: "phaseBefore",
                    player: "enterGame",
                },
                forced: true,
                locked: false,
                filter: function(event, player){
                    return event.name != "phase" || game.phaseNumber == 0;
                },
                content: async function(event, trigger, player){
                    var cards = get.cards(2);
                    await game.cardsGotoOrdering(cards);
                    await player.showCards(cards[0], "【飞升太虚】");
                    var difference = player.maxHp - cards[0].number;
                    var differencecurrent = player.hp - cards[0].number;
                    if (differencecurrent > 0){
                        await player.loseMaxHp(difference);
                    }
                    else {
                        if (difference < 0){
                            await player.gainMaxHp(-difference);
                            await player.recover(-differencecurrent);
                        }
                        else{
                            await player.loseMaxHp(difference);
                            await player.recover(-differencecurrent);
                        }
                    }
                    await player.showCards(cards[1], "【飞升太虚】");
                    //player.removeSkill("dhs_feishengtaixu2");
                    player.storage.dhs_feishengtaixu = cards[1].number;
                    //player.addSkill("dhs_feishengtaixu2");
                },
                sub: true,
                sourceSkill: "dhs_feishengtaixu",
                priority: 0,
                mod: {
                    maxHandcard: function(player, num) {
                        return player.storage.dhs_feishengtaixu;
                    },
                },
            }
        }
    },
    // 'dhs_feishengtaixu2': {
    //     mark: true,
    //     marktext: "虚",
    //     intro: {
    //         name: "飞升太虚",
    //         content: "手牌上限已更改"
    //     },
    //     forced: true,
    //     firstDo: true,
    //     mod: {
    //         maxHandcard: function(player, num) {
    //             return player.storage.dhs_feishengtaixu;
    //         },
    //     },
    //     filter: function(event, player){
    //         return player.countCards("h") > player.hp || player.maxHandcardBase < player.maxHp;
    //     },
    //     content: async function(event, trigger, player){},
    //     priority: 0,
    // },
    "dhs_xiaoyaozhiti": { //逍遥止啼：你的回合开始时，你可以获得一名其他角色的一张手牌，并令其本回合内无法使用无懈可击。
        audio: "ext:鸭子扩展/audio/skill:2",
        trigger :{
            player: 'phaseBegin',
        },
        filter: function (event, player){
            return game.hasPlayer(function (current){
                return current.countCards("h") > 0;
            });
        },
        content: async function (event, trigger, player){
            let result = await player.chooseTarget(true, "是否获得一名其他角色的一张手牌并令其本回合内无法使用无懈可击", function (card, player, target){
                return target.countCards('h') > 0 && target != player;
            })
            .set('ai', target => {
                const player = get.player();
                return get.effect(target, { name: "shunshou_copy2" }, player, player);
            })
            .forResult();
            if (result.bool){
                player.line(result.targets[0], 'red');
                game.log(player, '对', result.targets[0], "发动了", "【" + get.translation("dhs_xiaoyaozhiti") + "】");
                await player.gainPlayerCard(1, 'h', result.targets[0]);
                await game.delay();
                result.targets[0].addTempSkill("dhs_xiaoyaozhitinowuxie", "phaseAfter");
            }
        },
        ai: {
            threaten: 2.5,
            expose: 0.3,
        },
        mod: {
            maxHandcardBase: function(player, num) {
                return 3;
            },
        },
        priority: 2,
        derivation: "dhs_xiaoyaozhitinowuxie",
    },
    "dhs_xiaoyaozhitinowuxie": {
        audio: "ext:鸭子扩展/audio/skill:2",
        forced: true,
        mod: {
            wuxieJudgeEnabled: () => false,
            wuxieEnabled: () => false,
            cardEnabled: card => {
                if (card.name == "wuxie") return false;
            },
            aiValue: (player, card, val) => {
                if (card.name == "wuxie") return 0;
                var num = get.number(card);
                if (typeof get.strNumber(num, false) === "string") return val * 1.1;
            },
            aiUseful: (player, card, val) => {
                if (card.name == "wuxie") return 0;
                var num = get.number(card);
                if (typeof get.strNumber(num, false) === "string") return val * 1.1;
            },
        },
        trigger : {
            global: "useCard"
        },
        filter: function (event, player){
            return get.type(event.card) == 'trick';
        },
        content: async function (event, trigger, player){},
        ai: {
            playernowuxie: true,
        },
        mark: true,
        marktext: '止啼',
        intro: {
            name: '逍遥止啼',
            content: '本回合无法使用无懈可击',
        },
        sub: true,
        sourceSkill: 'dhs_xiaoyaozhiti',
    },
    "dhs_bailangchihui": { //白狼持麾：你的回合开始时，你可以令一名角色获得【🐺白狼】标记直到你的下回合开始。当有角色对有【🐺白狼】标记的角色使用【杀】时，其摸一张牌。
        audio: "ext:鸭子扩展/audio/skill:2",
        trigger: {
            player: "phaseBegin",
        },
        check: function (event, player){
            if (game.hasPlayer( function (current){
                return get.attitude(player, current) < -0.5
            })) return true;
            else return false;
        },
        filter: function (event, player){return true;},
        content: async function (event, trigger, player){
            player.storage.dhs_bailangchihui = [];
            let result = await player.chooseTarget(true, "选择一名角色，令其获得【🐺白狼】标记")
            .set('ai', target => {
                var att = get.attitude(player, target);
                if (att > 1) return 0.01;
                var basis = att * get.threaten(target);
                if (basis < -1){
                    return -basis;
                }
                else return att;
            })
            .forResult();
            if (result.bool){
                player.line(result.targets[0], 'red');
                game.log(player, '对', result.targets[0], "发动了", "【" + get.translation("dhs_bailangchihui") + "】");
                result.targets[0].addSkill("dhs_bailangchihuimark");
                player.storage.dhs_bailangchihui.push(result.targets[0]);
                await game.delay();
            }
        },
        ai: {
            threaten: 1.5,
            expose: 0.3,
        },
        priority: 1,
        derivation: 'dhs_bailangchihuimark',
        group: 'dhs_bailangchihui_expire',
        subSkill: {
            expire: {
                forced: true,
                nopop: true,
                popup: false,
                trigger: {
                    player: ['phaseBefore', "dieBegin"],
                },
                filter: function (event, player){
                    if (event.name == "die") return true;
                    let target = player.storage.dhs_bailangchihui;
                    if (target && !target[0].isDead() && target[0].isIn() && target[0].hasSkill("dhs_bailangchihuimark")) return true;
                    return false;
                },
                content: async function (event, trigger, player){
                    player.storage.dhs_bailangchihui[0].removeSkill("dhs_bailangchihuimark");
                },
                sub: true,
                sourceSkill: "dhs_bailangchihui",
            }
        }
    },
    "dhs_bailangchihuimark": {
        audio: "ext:鸭子扩展/audio/skill:1",
        mark: true,
        marktext: "🐺",
        intro: {
            name: '白狼',
            content: "其他角色对你使用【杀】时摸一张牌",
        },
        sub: true,
        sourceSkill: 'dhs_bailangchihui',
        forced: true,
        trigger: {
            target: "useCardToTargeted",
        },
        filter: function (event, player){
            return event.card.name == "sha";
        },
        content: async function (event, trigger, player){
            await trigger.player.draw();
        },
        ai: {
            effect: {
                target(card, player, target){
                    if (card.name == 'sha') return 1.5;
                }
            },
            value(card, player){
                if(card.name == "shan") return get.value(card) * 1.5;
                return get.value(card);
            },
            neg: true,
        },
    },
    'dhs_wenhouwushuang': { //温侯无双：锁定技。①当你获得锦囊牌后，将其转化为两张【杀】。②你的【杀】不可闪避。
        audio: "ext:鸭子扩展/audio/skill:2", //参考[mengye]梦,
        charlotte: true,
        forced: true,
        trigger: {
            player: "gainAfter",
        },
        filter: function (event, player){
            return event.cards.some(card => get.type(card) == "trick" || get.type(card) == "delay");
        },
        content: async function (event, trigger, player){
            var cards = player.getCards("h", function (card){
                return get.type(card) == "trick" || get.type(card) == "delay";
            });
            cards.forEach(function(card, index, theArray){
                let newCard = card.init([card.suit, card.number, 'sha']);
                theArray[index] = newCard;
                player.gain(game.createCard("sha", newCard.suit, newCard.number));
            });
        },
        group: ['dhs_wenhouwushuang_qiangming', 'dhs_wenhouwushuang_start'],
        subSkill: {
            qiangming: {//[hanbei]悍北
                audio: "ext:鸭子扩展/audio/skill:2",
                charlotte: true,
                forced: true,
                trigger: {
                    player: "shaBegin",
                },
                content: async function (event, trigger, player){
                    trigger.directHit = true;
                },
                ai: {
                    "directHit_ai": true,
                    skillTagFilter: function (player, tag, arg){
                        if (arg.card.name != 'sha') return false;
                    },
                    threaten: 2,
                },
                mod: {
                    maxHandcardBase: function(player, num) {
                        return 2;
                    },
                },
                sub: true,
                sourceSkill: "dhs_wenhouwushuang",
            },
            start: {
                audio: ["dhs_wenhouwushuang", 2],
                trigger: {
                    global: "phaseBefore",
                    player: "enterGame",
                },
                forced: true,
                locked: false,
                filter: function(event, player){
                    return event.name != "phase" || game.phaseNumber == 0;
                },
                content: async function(event, trigger, player){
                    var cards = player.getCards("h", function (card){
                        return get.type(card) == "trick" || get.type(card) == "delay";
                    });
                    cards.forEach(function(card, index, theArray){
                        let newCard = card.init([card.suit, card.number, 'sha']);
                        theArray[index] = newCard;
                        player.gain(game.createCard("sha", newCard.suit, newCard.number));
                        
                    });
                },
                sub: true,
                sourceSkill: "dhs_wenhouwushuang",
                priority: 0,
            },
        },
        ai: {
            halfneg: true,
        }
    },
    "dhs_langziyexin": {//狼子野心：当你使用【杀】造成伤害后，你可以令你攻击范围内的另外一名其他角色选择一项：1.交给你两张牌；2.你可以对其使用一张不计入出杀次数的【杀】。
        audio: "ext:鸭子扩展/audio/skill:2",
        trigger: {
            source: "damageSource",
        },
        direct: true,
        filter: function(event, player) {
            if (event._notrigger.includes(event.player)) return false;
            if (!game.hasPlayer(function (current){
                return player.inRange(current) && current != player && current != event.player
            })) return false;
            return event.card && event.card.name == "sha";
        },
        content: async function (event, trigger, player){
            let target = await player.chooseTarget("选择一名其他角色，令其交给你两张牌或你可对其使用一张不计入出杀次数的【杀】", function (card, player, target){
                return target != player && player.inRange(target) && target != trigger.player;
            }).set("ai", target => {
                return 1 - get.attitude(player, target);
            }).forResult();
            if (target.bool){
                //播语音，记录等
                player.logSkill("dhs_langziyexin", target.targets[0]);
                let skillTarget = target.targets[0];
                let result = await skillTarget.chooseCard(2, "he", "交给" + get.translation(player) + "两张牌,否则" + get.translation(player) + "可以对你使用一张【杀】")
                .set("ai", (card) => {
                    if (skillTarget.hasSkillTag("nodamage")) return 0;
                    if (skillTarget.hasSkillTag("noe") && get.type(card) == "equip") return 11;
                    if (skillTarget.hp == 1 && player.mayHaveSha(skillTarget)) return 11 - get.value(card);
                    if (skillTarget.hp > 2){
                        if (skillTarget.hasSkillTag("maixie_defend") || skillTarget.hasSkillTag("maixie")) return 0;
                        if (!player.mayHaveSha(skillTarget)){
                            return 5 - get.value(card);
                        }
                        else return 7 - get.value(card);
                    }
                    else{
                        if (!player.mayHaveSha(skillTarget)){
                            return 7- get.value(card);
                        }
                        else return 10 - get.value(card);
                    }
                })
                .forResult();
                if (result.bool) {
                    //播语音（给牌）
                    await game.delay();
                    game.playAudio("..", "extension", "鸭子扩展/audio/skill", "dhs_langziyexinsubmit1");
                    await skillTarget.give(result.cards, player);
                }
                else {
                    if (player.countCards('h', 'sha') > 0){
                        await game.delay();
                        game.playAudio("..", "extension", "鸭子扩展/audio/skill", "dhs_langziyexinreject1");
                        let usedSha = await player.chooseToUse(function (card, player, event) {
                            if (get.name(card) != 'sha') return false;
                            return lib.filter.filterCard.apply(this, arguments);
                        }, "是否对" + get.translation(skillTarget) + "使用一张不计入出杀次数的【杀】？")
                        .set("targetRequired", true)
                        .set("complexSelect", true)
                        .set("filterTarget", function (card, player, target){
                            if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
                            return lib.filter.targetEnabled.apply(this, arguments);
                        })
                        .set("sourcex", skillTarget)
                        .set("addCount", false)
                        .forResult();
                        //game.print(usedSha.bool);
                    }
                }
            }
        },
        ai: {
            expose: 0.2,
            threaten: 1,
        },
    },
    "dhs_yuanmensheji":{//辕门射戟：限定技，当其他角色成为【杀】的目标时，你可以打出一张【杀】，令此【杀】无效。
        //参考[vtbshanwu]闪舞，[zybishi]避世
        audio: "ext:鸭子扩展/audio/skill:2",
        unique: true,
        limited: true,
        skillAnimation: true,
        animationColor: "fire",
        direct: true,
        trigger: {
            global: 'useCardToTarget',
        },
        filter: function (event, player){
            return (
                event.card.name == "sha" &&
                event.target != player &&
                player.hasCard(card => {
                    return get.name(card) == 'sha' || _status.connectMode;
                }) &&
                event.player != player
            );
        },
        content: async function (event, trigger, player){
            let prompt = "是否发动【辕门射戟】，打出一张【杀】，令此杀无效？";
            let result = await player.chooseToRespond(prompt, (card, player) => {
               return card.name == "sha";
            }).set("ai", card => {
                const player = get.player(),
                event = get.event();
                let targets = event.targets;
                const source = event.getParent().player;
                if (get.attitude(player, source) < -1){
                    if (!targets.some(target => {
                        get.attitude(player, target) > 1;
                    })) return -1;
                    else if (targets.some(target => {
                        get.attitude(player, target) > 1 && target.hp <= 2;
                    })) return 1;
                    else if (targets.length > 1) return 1;
                    else return -1;
                }
                else {
                    return -1;
                }
            })
            .forResult();
            if (result.bool){
                player.awakenSkill("dhs_yuanmensheji");
                player.logSkill("dhs_yuanmensheji");
                player.line(trigger.player, "green");
                var evt = trigger.getParent();
                evt.targets.length = 0;
                evt.all_excluded = true;
                game.log(evt.card, "被无效了");
            }
        },
        ai: {
            expose: 0.1,
            effect: {
                target(card, player, target){
                    if(card.name == "sha") return 1.2;
                }
            },
        }
    }
};

export default skills;