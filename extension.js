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
            "quack_visha": ["female", "empire", "4/4", ["ys_yancong","ys_shanzhan"],[ //维多利亚：帝国，4血，技能：严从，善战。 严从：其他角色使用杀或锦囊牌结算完毕后，你可以弃置一张牌，视为对其中一名目标角色使用一张无视距离的【杀】。若此【杀】没有造成伤害，你受到一点伤害并获得目标角色区域内的一张牌。
                "des:维多莉亚·伊娃诺娃·谢列布里亚科夫少尉，又称维夏。谭雅的副官。", //善战：当你使用或打出一张【杀】时，或受到伤害后，你可以摸一张牌。
                "ext:鸭子扩展/image/character/quack_visha.jpg",
                "die:ext:鸭子扩展/audio/die/quack_visha.mp3",
                "forbidai"
            ]],
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
                group: ["ys_yancong_chusha", "ys_yancong_damage"], //两个部分，一个视为出杀，一个负责处理没造成伤害后
                subSkill:{
                    'chusha':{ //代码参考[zuoding]佐定, [reqianxi]潜袭, [gongshen]工神, [nifu]匿伏, [heji]合击
                        trigger: {
                            global: "useCardAfter", //有角色使用牌结算完毕后
                        },
                        skillAnimation: 'true',
                        animationColor: 'grey',
                        prompt: '是否发动【严从】，弃置一张牌并视为对其中一名目标角色使用一张无视距离的【杀】？',
                        filter: function(event, player) {
                            return event.player != player && //其他角色
                            (event.card.name == 'sha' || get.type(event.card) == 'trick') && //使用杀或锦囊牌
                            event.targets && //有目标
                            event.targets.length > 0 && //目标至少为一人
                            event.targets.some(target => !target.isDead()) && //目标里有存活角色
                            !(event.targets.includes(player) && event.targets.length == 1) && //目标中有自己的话，目标至少为两人
                            player.countCards('he') > 0; //自己有牌来弃置
                        },
                        content: async function(event, trigger, player) {
                            //game.print('严从触发啦！') //测试用
                            await player.chooseToDiscard('he', '请弃置一张牌', true).forResult(); //选择一张牌弃置（强制）
                            let target = await player.chooseTarget(true, '请选择其中一名目标角色，视为对其使用一张无视距离的【杀】', function (card, player, target){ //选择目标（强制）
                                return target != player && get.event().getTrigger().targets.includes(target) && target.isIn(); //只能选择目标角色中的一个
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
                        popup: false,
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
        },
        translate: {
            "ys_yancong": "严从",
            "ys_yancong_info": "其他角色使用【杀】或锦囊牌结算完毕后，你可以弃置一张牌，视为对其中一名目标角色使用一张无视距离的【杀】。若此【杀】没有造成伤害，你受到一点伤害并获得目标角色区域内的一张牌。",
            "ys_shanzhan": "善战",
            "ys_shanzhan_info": "当你使用或打出一张【杀】时，或受到伤害后，你可以摸一张牌。",
        },
    },
    intro: "",
    author: "Plyasm",
    diskURL: "",
    forumURL: "",
    version: "1.0",
},files:{"character":[],"card":[],"skill":[],"audio":[]},connect:false} 
};