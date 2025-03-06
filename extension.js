import { lib, game, ui, get, ai, _status } from "../../noname.js";
export const type = "extension";
export default function(){
	return {name:"鸭子扩展",arenaReady:function(){
    
},content:function(config,pack){
/*     //千幻聆音武将换肤换音前提代码
    if(!lib.qhlypkg) lib.qhlypkg=[];
	lib.qhlypkg.push({
		isExt:true,
		filterCharacter:function(name){
			return name.indexOf('quack_')==0 || name.indexOf('dsh_')==0;
		},
		prefix:'extension/鸭子扩展/image/character/',
		skin:{
			standard:'extension/鸭子扩展/skin/image/',
    		origin:'extension/鸭子扩展/skin/yuanhua/',
		},
		audioOrigin:'extension/鸭子扩展/audio/',
		audio:'extension/鸭子扩展/skin/audio/',
	});
    //阵亡配音
	lib.skill._zhenwangpeiyin={
		trigger:{
			player:'dieBegin',
		},
		fixed:true,
		forced:true,
		unique:true,
		popup:false,
		lastDo:true,
		charlotte:true,
		superCharlotte:true,
		filter:function(event,player){
			return event.player.name.indexOf('quack_')==0 || event.player.name.indexOf('dsh_')==0;
		},
		content:function(){
			game.playAudio('..','extension','鸭子扩展/audio/character',trigger.player.name);
		},
	}; */
    lib.character.dieAudio = {
        dhs_xiaohe: [
            "ext:鸭子扩展/audio/die/dhs_xiaohe1.mp3",
            "ext:鸭子扩展/audio/die/dhs_xiaohe2.mp3"
        ]
    };
    lib.translate["#ext:鸭子扩展/audio/die/dhs_xiaohe1"] = "功未成，已作枯骨......";
    lib.translate["#ext:鸭子扩展/audio/die/dhs_xiaohe2"] = "社稷安危，又待托付何人？";
},prepare:function(){
    
},precontent:function(){
    let empireConfig = {
        color: '#160D08',
    }
    game.addGroup('empire', '帝', '帝国', empireConfig);
    let xihanConfig = {
        color: '#000000',
    }
    game.addGroup('xihan', '西', '西汉', xihanConfig);
    lib.namePrefix.set("代号杀", {showName: "代号杀", color: '#FF2800'});
},config:{},help:{},package:{
    character: {
        character: {
            "quack_visha": ["female", "empire", "4/4", ["ys_yancong","ys_qiangshi", "ys_shanzhan"],[ //维多利亚：帝国，4血，技能：严从，善战。 严从：每回合每名角色限一次。其他角色使用杀或锦囊牌结算完毕后，你可以弃置X张牌，视为对其中一名目标角色使用一张无视距离的【杀】（X为此牌目标角色数）。若此【杀】没有造成伤害，你受到一点伤害并获得目标角色区域内的一张牌。
                "des:维多莉亚·伊娃诺娃·谢列布里亚科夫少尉，又称维夏。谭雅的副官。", //善战：帝国势力技，当你使用或打出一张【杀】时，或受到伤害后，你可以摸一张牌。
                "ext:鸭子扩展/image/character/quack_visha.png", //强食：锁定技。①当你回复体力时，你弃置一张手牌，令此次回复值+1。②每轮限一次，一名角色回合结束时，若你本回合弃置牌数不少于你体力值，你从弃牌堆中获得一张【桃】。
                "die:ext:鸭子扩展/audio/die/quack_visha.mp3",
                "forbidai"
            ]],
            //"quack_tanya"         //谭雅：帝国，3血，技能：狙击，神佑，质神，善战。 狙击：锁定技。①出牌阶段开始时，你摸一张牌并将一张牌置于武将牌上，称为“弹”。②你使用【杀】时，若“弹”中有牌，你将一张“弹”置入弃牌堆。③你的武将牌上有“弹”时，你使用杀无距离限制。
            // 神佑：限定技，出牌阶段，若你的“祈”标记数不小于X，你可以弃置所有“祈”标记，对一名其他角色造成2点伤害并且对与其距离为1的所有其他角色造成1点伤害（X为场上的）。
            // 质神：当你于摸牌阶段外摸牌时，你可以获得1个“祈”标记。
            // 善战：帝国势力技，当你使用或打出一张【杀】时，或受到伤害后，你可以摸一张牌。

            //"dhs_zuoci"   //代号杀左慈：东汉，1血，技能：掷杯戏曹，遁甲天书，飞升太虚。 掷杯戏曹：你使用牌指定其他角色为唯一目标时，可以额外指定1个虚假目标，该目标可以响应此牌（无效果）。
            // 遁甲天书：你的回合开始前，你从三名随机武将中选择一名，你获得其所有技能知道你的下回合开始。
            // 飞升太虚：游戏开始或回合开始时，你依次亮出牌顶的两张牌，你的体力值与手牌上限变为牌的点数。
            // 旧王异代码
            /*
            {
    audio: 2,
    trigger: {
        player: "judge",
    },
    check: check(event, player) {
        return event.judge(player.judging[0]) < 0;
    },
    content: content() {
        "step 0";
        var card = get.cards()[0];
        event.card = card;
        game.cardsGotoOrdering(card).relatedEvent = trigger;
        "step 1";
        player.$throw(card);
        if (trigger.player.judging[0].clone) {
            trigger.player.judging[0].clone.classList.remove("thrownhighlight");
            game.broadcast(function (card) {
                if (card.clone) {
                    card.clone.classList.remove("thrownhighlight");
                }
            }, trigger.player.judging[0]);
            game.addVideo("deletenode", player, get.cardsInfo([trigger.player.judging[0].clone]));
        }
        game.cardsDiscard(trigger.player.judging[0]);
        trigger.player.judging[0] = card;
        game.log(trigger.player, "的判定牌改为", card);
        game.delay(2);
    },
    "_priority": 0,
}
            */
           "dhs_xiaohe":["male", "xihan", "4/4", ["dhs_chengye", "dhs_baiye"],[
                "des:代号杀萧何。",
                "ext:鸭子扩展/image/character/dhs_xiaohe.jpg",
                "die:ext:鸭子扩展/audio/die/dhs_xiaohe.mp3"
            ]],
        },
        translate: {
            "quack_visha": "维多莉亚",
            "dhs_xiaohe": "代号杀萧何",
            "#ext:鸭子扩展/audio/die/my_general:die": '功未成，已作枯骨......',
            "dhs_xiaohe_prefix": "代号杀"
        },
    },
    card: {
        card: {
        },
        translate: {
        },
        list: [],
    },
    skill: {
        skill: {
            "ys_yancong": { //严从
                group: ["ys_yancong_chusha", "ys_yancong_damage", "ys_yancong_count"], //三个部分，一个视为出杀，一个负责处理没造成伤害后，一个负责记录已经对谁发动过技能
                subSkill:{
                    'chusha':{ //代码参考[zuoding]佐定, [reqianxi]潜袭, [gongshen]工神, [nifu]匿伏, [heji]合击, [junchi]骏驰
                        trigger: {
                            global: "useCardAfter", //有角色使用牌结算完毕后
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
            "dhs_chengye": { //成也：回合结束时，你可以令一名其他角色立即进行一个出牌阶段，且此阶段其使用牌时，其摸一张牌。
                audio: "ext:鸭子扩展/audio/skill:2",
                trigger: {
                    player: "phaseEnd",
                },
                check: function(event, player){ //检查是否该发动技能
                    if (game.players.length > 2){
                        return 1;
                    }else return -1;
                },
                content: async function(event, trigger, player) {
                    let target = await player.chooseTarget(true, '请选择一名其他角色，其立即进行一个出牌阶段，且此阶段使用牌后摸一张牌', function (card, player, target){
                        return target != player; //选择一名其他角色
                    }).set("ai", target => {
                        var player = _status.event.player,
                        att = get.attitude(player, target);
                        if (target.hasSkillTag("nogain")) return 0.01 * att;
                        if (target.hasJudge("lebu")) att *= 1.25;
                        if (target.countCards("h") > target.hp) att *= 1.10;
                        if (get.attitude(player, target) > 3) {
                            var basis = get.threaten(target) * att;
                            if (target.countCards("h") < target.hp) return basis * 0.8;
                            return basis;
                        } else return 0;
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
                    var enemy = _status.event.player,
                    att = get.attitude(player, enemy);
                    if (enemy.hasSkillTag("nodamage")) return -1; //如果对方免疫伤害不发动
                    if (enemy.hasSkillTag("filterDamage")) att *= 0.5 //如果对方有减伤，不倾向于发动
                    if (enemy.countCards("he") == 0) att *= 1.5; //如果对方没有装备和手牌，倾向于发动
                    if (att < -1){ //如果是敌对关系，则进入进一步判断
                        var basis = get.threaten(enemy) * att; //根据对方的威胁度判断
                        if (enemy.countCards("h") >= 2  && enemy.mayHaveShan(player, "use", enemy.getCards("h", i => {return i.hasGaintag("sha_notshan");}))) basis *= 0.5; //如果对方有至少两张手牌且有可能有闪则不倾向于发动
                        if (enemy.hp <= 2) basis *= 1.5; //如果对方残血则倾向于发动
                        if (basis >= 10){
                            return 1; //超过一定的数值，发动
                        }
                        else return -1; //没有达到标准，不发动
                    } else return -1; //如果不是敌对关系，不发动
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
                            if (targetatt > 1) att *= 1.2; //如果目标和受害者是队友则倾向于对他发动
                            if (targetatt < -1) att *= 0.8; //尽量不与受害者敌对阵营发动
                            if (att < -1){ //如果玩家与目标是敌人
                                var basis = get.threaten(target) * att; //按照威胁度调整判断
                                if  (target.countCards("h") < target.hp) basis *= 0.8; //如果目标牌比较少不倾向于选他
                                if (target.mayHaveSha(player, "use", null, "count") >= 2) basis *= 1.2; //如果目标杀比较多倾向于选他
                                return -basis;
                            } else {
                                var basis = get.threaten(target) * att;
                                if  (target.countCards("h") < target.hp) basis *= 0.8;
                                if (target.mayHaveSha(player, "use", null, "count") >= 2) basis *= 1.2;
                                return basis*= 0.6; //不是与目标敌人的话就尽量不选他
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
        },
        translate: {
            "ys_yancong": "严从",
            "ys_yancong_info": "每回合每名角色限一次。其他角色使用杀或普通锦囊牌结算完毕后，你可以弃置X张牌，视为对其中一名目标角色使用一张无视距离的【杀】（X为此牌目标角色数）。若此【杀】没有造成伤害，你受到一点伤害并获得目标角色区域内的一张牌。",
            "ys_shanzhan": "善战",
            "ys_shanzhan_info": "帝国势力技，当你使用或打出一张【杀】时，或受到伤害后，你可以摸一张牌。",
            "ys_qiangshi": "强食",
            "ys_qiangshi_info": "锁定技。①当你回复体力时，你弃置一张手牌，令此次回复值+1。②每轮限一次，一名角色回合结束时，若你本回合弃置牌数不少于你体力值，你从弃牌堆中获得一张【桃】。",
            "dhs_baiye": "败也",
            "dhs_baiye_info": "限定技，其他角色出牌阶段结束时，若其在此阶段内使用过的牌数大于三张，你可以令一名除其以外的其他角色对其依次使用手牌中的所有【杀】，直到其进入濒死状态。",
            "dhs_chengye": "成也",
            "dhs_chengye_info": "回合结束时，你可以令一名其他角色立即进行一个只有出牌阶段的额外回合，且此阶段其使用牌时，其摸一张牌。",
            "dhs_chengyedraw": "成也",
            "dhs_chengyedraw_info": "当你使用牌时，摸一张牌。",
            "#dhs_baiye1": "忧患生于所忽，祸起于细微。",
            "#dhs_baiye2": "阻其图，夺其虑，乘其惧。",
            "#dhs_chengye1": "有力者疾以助人，有道者劝以教人。",
            "#dhs_chengye2": "君子成人之美。",
            "#dhs_chengyedraw1": "至如信者，国士无双。",
            "#dhs_chengyedraw2": "令民得入田，毋收稿为禽兽食。",
        },
    },
    intro: "一个闲鱼鸭子扩展，目前只有维多莉亚，和代号杀的萧何。以后会增加更多。",
    author: "Plyasm",
    diskURL: "https://github.com/Plyasm/quackextension",
    forumURL: "",
    version: "0.2",
},files:{"character":[],"card":[],"skill":[],"audio":[]},connect:false} 
};