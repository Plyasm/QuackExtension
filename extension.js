import { lib, game, ui, get, ai, _status } from "../../noname.js";
export const type = "extension";
export default function(){
	return {name:"鸭子扩展",arenaReady:function(){
    
},content:function(config,pack){
    
},prepare:function(){
    
},precontent:function(){
    let empireConfig = {
        color: '#160D08',
    }
    game.addGroup('empire', '帝', '帝国', empireConfig);
},config:{},help:{},package:{
    character: {
        character: {
            "quack_visha": ["female", "empire", "4/4", ["ys_yancong","ys_qiangshi", "ys_shanzhan"],[ //维多利亚：帝国，4血，技能：严从，善战。 严从：每回合每名角色限一次。其他角色使用杀或锦囊牌结算完毕后，你可以弃置X张牌，视为对其中一名目标角色使用一张无视距离的【杀】（X为此牌目标角色数）。若此【杀】没有造成伤害，你受到一点伤害并获得目标角色区域内的一张牌。
                "des:维多莉亚·伊娃诺娃·谢列布里亚科夫少尉，又称维夏。谭雅的副官。", //善战：帝国势力技，当你使用或打出一张【杀】时，或受到伤害后，你可以摸一张牌。
                "ext:鸭子扩展/image/character/quack_visha.png", //强食：锁定技。①当你回复体力时，你弃置一张手牌，令此次回复值+1。②每轮限一次，一名角色回合结束时，若你本回合弃置牌数不少于你体力值，你从弃牌堆中获得一张【桃】。
                "die:ext:鸭子扩展/audio/die/quack_visha.mp3",
                "forbidai"
            ]],
            //"quack_tanya"         //谭雅：帝国，3血，技能：狙击，，神佑，质神，善战。 狙击：锁定技。①出牌阶段开始时，将一张牌置于武将牌上，称为“弹”。②你使用【杀】时，若“弹”中有牌，你将之置入弃牌堆，令此杀无法被响应。③你的武将牌上有“弹”时，你使用杀无距离限制。
            // 神佑：限定技，出牌阶段，若你的“祈”标记数不小于X，你可以弃置所有“祈”标记，对一名其他角色造成2点伤害并且对与其距离为1的所有其他角色造成1点伤害（X为场上的）。
            // 质神：你使用一张锦囊牌时，你可以摸一张牌然后弃置X张手牌，获得X个“祈”标记。你使用【杀】造成伤害时，你可以弃一枚“祈”，令此伤害+1。
            // 善战：帝国势力技，当你使用或打出一张【杀】时，或受到伤害后，你可以摸一张牌。
        },
        translate: {
            "quack_visha": "维多莉亚",
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
                            return event.player != player && //其他角色
                            (event.card.name == 'sha' || get.type(event.card) == 'trick') && //使用杀或锦囊牌
                            event.targets && //有目标
                            event.targets.length > 0 && //目标至少为一人
                            event.targets.some(target => !target.isDead()) && //目标里有存活角色
                            !(event.targets.includes(player) && event.targets.length == 1) && //目标中有自己的话，目标至少为两人
                            player.countCards('he') >= event.targets.length; //自己有足够多的牌来弃置
                        },
                        content: async function(event, trigger, player) {
                            //game.print('严从触发啦！') //测试用
                            let targetamount = get.event().getTrigger().targets.length; //目标数
                            await player.chooseToDiscard(targetamount, 'he', '请弃置' + get.cnNumber(targetamount, true) + '张牌', true).forResult(); //选择一张牌弃置（强制）
                            let target = await player.chooseTarget(true, '请选择其中一名目标角色，视为对其使用一张无视距离的【杀】', function (card, player, target){ //选择目标（强制）
                                return target != player && get.event().getTrigger().targets.includes(target) && target.isIn() && !(player.storage.ys_yancong_count); //只能选择目标角色中的一个，且不能是自己，且不能是已经发动过技能的角色
                            }).forResult(); //选择一名角色
                            if (target.bool){
                                let skillTarget = target.targets[0];
                                player.storage.chusha = true; //记录出杀
                                await player.useCard({name: 'sha'}, skillTarget, false); //视为对角色使用一张无视距离的【杀】
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
                            player: "ys_yancong_chushaContentAfter", //对一名角色发动严从后
                        },
                        priority: 10,
                        forced: true,
                        content: async function(event, trigger, player) {
                            if (trigger.name == 'phase'){ //如果是回合结束后
                                if (player.storage.ys_yancong_count) delete player.storage.ys_yancong_count; //清除已发动过技能记录
                            }
                            else if (trigger.name == 'ys_yancong_chushaContent'){ //如果是对一名角色发动严从后
                                if (!player.storage.ys_yancong_count) player.storage.ys_yancong_count = []; //初始化已发动过技能记录
                                player.storage.ys_yancong_count.push(trigger.target); //记录已发动过技能
                                //game.print('记录已发动过技能的目标为' + get.translation(trigger.target)); //测试用
                            }
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
                        intro: {
                            content: '本轮已发动【强食】',
                        },
                        popup: false,
                        nopop: true,
                        sub: true,
                        sourceSkill: 'ys_qiangshi',
                    },
                },
            },
        },
        translate: {
            "ys_yancong": "严从",
            "ys_yancong_info": "每回合每名角色限一次。其他角色使用杀或锦囊牌结算完毕后，你可以弃置X张牌，视为对其中一名目标角色使用一张无视距离的【杀】（X为此牌目标角色数）。若此【杀】没有造成伤害，你受到一点伤害并获得目标角色区域内的一张牌。",
            "ys_shanzhan": "善战",
            "ys_shanzhan_info": "帝国势力技，当你使用或打出一张【杀】时，或受到伤害后，你可以摸一张牌。",
            "ys_qiangshi": "强食",
            "ys_qiangshi_info": "锁定技。①当你回复体力时，你弃置一张手牌，令此次回复值+1。②每轮限一次，一名角色回合结束时，若你本回合弃置牌数不少于你体力值，你从弃牌堆中获得一张【桃】。",
        },
    },
    intro: "一个闲鱼鸭子扩展，目前只有维多莉亚一个角色。以后会增加更多。",
    author: "Plyasm",
    diskURL: "https://github.com/Plyasm/quackextension",
    forumURL: "",
    version: "0.1",
},files:{"character":[],"card":[],"skill":[],"audio":[]},connect:false} 
};