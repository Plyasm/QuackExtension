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
            "quack_visha": ["female", "empire", 4/4, ["ys_yancong","ys_shanzhan"],[ //维多利亚：帝国，4血，技能：严从，善战。 严从：其他角色使用杀或锦囊牌指定角色后，你可以弃置一张牌，视为对其中一名目标角色使用一张无视距离的【杀】。若此【杀】没有造成伤害，你受到一点伤害并获得目标角色区域内的一张牌。
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
                group: ["ys_yancong_expire", "ys_yancong_chusha", "ys_yancong_damage"], //三个部分，一个检查杀造成伤害，一个视为出杀，一个负责处理没造成伤害后
                subSkill:{
                    'expire':{
                        trigger:{
                            source: 'damageAfter', //造成伤害后
                        },
                        forced: true,
                        popup: false,
                        silent: true,
                        filter: function(event){
                            return event.parent.skill == 'ys_yancong_chusha' && //如果是严从造成的
                            event.card.name == 'sha'; //且是【杀】
                        },
                        content : async function(){
                            console.log('严从造成伤害啦！') //测试用
                            player.storage.yancong = true;
                        },
                        sub: true,
                        sourceSkill: 'ys_yancong',
                    },
                    'chusha':{
                        trigger: {
                            global: "useCardToPlayered", //有角色使用牌指定角色后
                        },
                        filter: function(event, player) {
                            return event.player != player && //其他角色
                            (event.card.name == 'sha' || event.card.type == 'trick') && //使用杀或锦囊牌
                            event.targets && //有目标
                            event.targets.length && //有目标
                            player.countCards('he') > 0; //自己有牌来弃置
                        },
                        content: async function(event, player) {
                            console.log('严从触发啦！') //测试用
                            let card = await player.chooseCard('he', '请选择一张牌弃置').forResult(); //选择一张牌弃置
                            if (card.bool){
                                await player.discard(card.cards);
                            }
                            let target = await player.chooseTarget('请选择其中一名目标角色', function (target){
                                return event.targets.contains(target);
                            }).forResult(); //选择一名角色
                            if (target.bool){
                                let target = target.targets[0];
                                await player.useCard({name: 'sha'}, target, false); //视为对角色使用一张无视距离的【杀】
                            }
                        },
                        sub: true,
                        sourceSkill: 'ys_yancong',
                    },
                    'damage':{
                        trigger: {
                            player: 'shaAfter', //使用杀之后
                        },
                        forced: true,
                        popup: false,
                        content: async function() {
                            if (this.trigger.parent.skill == 'ys_yancong'){ //如果是严从出的杀
                                if (!player.storage.yancong){ //如果没有造成伤害
                                    console.log('处理严从未造成伤害中！') //测试用
                                    await player.damage(1, 'nosource'); //受到一点无来源伤害
                                    await player.gainPlayerCard(this.trigger.target, 'hej', true); //获得目标角色区域内的一张牌
                                }
                            }
                        },
                        sub: true,
                        sourceSkill: 'ys_yancong',
                    },
                }
            },
            "ys_shanzhan": {
                usable: 1,
                frequent: true,
                trigger: {
                    player: [ //当你
                        'useCard', //使用卡牌
                        'respond', //打出卡牌
                        'damageEnd', //受到伤害后
                    ]
                },
                filter: function(event, player) {
                    return event.card.name == 'sha' || //使用或打出的是【杀】
                    this.trigger.player == 'damageEnd'; //或者是受到伤害后
                },
                content: async function() {
                    console.log('善战触发啦！') //测试用
                    await player.draw(1);
                },
            },
        },
        translate: {
            "ys_yancong": "严从",
            "ys_yancong_info": "其他角色使用【杀】或锦囊牌指定角色后，你可以弃置一张牌，视为对其中一名目标角色使用一张无视距离的【杀】。若此【杀】没有造成伤害，你受到一点伤害并获得目标角色区域内的一张牌。",
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