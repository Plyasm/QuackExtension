import { lib, game, ui, get, ai, _status } from "../../noname.js";
import characters from "./character.js";
import skills from "./skill.js";
//import characterReplaces from "./characterReplace.js";
import { characterSort, characterSortTranslate } from "./sort.js";
import voices from "./voices.js";
import characterTranslates from "./characterTranslate.js";
import skillTranslates from "./skillTranslate.js";
game.import("extension", function(){
    return {
        name: "鸭子扩展",
        content: function(){
            lib.skill._zhenwangpeiyin={ //阵亡配音系统
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
                    return event.player.name.indexOf('quack_')==0 || event.player.name.indexOf('dhs_')==0;
                },
                content:function(event, trigger, player){
                    if (event.player.name.indexOf('quack_')==0){
                        game.playAudio('..','extension','鸭子扩展/audio/die',trigger.player.name);
                    }
                    else if (event.player.name.indexOf('dhs_')==0){ //代号杀角色有两个阵亡配音
                        game.playAudio('..','extension','鸭子扩展/audio/die',trigger.player.name + [1,2].randomGet().toString());
                    }
                },
            };
            lib.skill._entrancepeiyin={ //登场配音系统
                trigger:{
                    player: "phaseBegin",
                },
                fixed:true,
                forced:true,
                unique:true,
                popup:false,
                lastDo:true,
                charlotte:true,
                superCharlotte:true,
                filter:function(event,player){
                    return (event.player.name.indexOf('quack_')==0 || event.player.name.indexOf('dhs_')==0) && player.phaseNumber == 1;
                },
                content:function(event, trigger, player){
                    if (event.player.name.indexOf('quack_')==0){
                        game.playAudio('..','extension','鸭子扩展/audio/entrance',trigger.player.name);
                    }
                    else if (event.player.name.indexOf('dhs_')==0){ //代号杀角色有两个登场语音
                        game.playAudio('..','extension','鸭子扩展/audio/entrance',trigger.player.name + [1,2].randomGet().toString());
                    }
                },
            };
            lib.skill._jishapeiyin={ //击杀配音系统
                trigger:{
                    source: "dieAfter",
                },
                fixed:true,
                forced:true,
                unique:true,
                popup:false,
                lastDo:true,
                charlotte:true,
                superCharlotte:true,
                filter:function(event,player){
                    return (player.name.indexOf('quack_')==0 || player.name.indexOf('dhs_')==0);
                },
                content:function(event, trigger, player){
                    if (player.name.indexOf('quack_')==0){
                        game.playAudio('..','extension','鸭子扩展/audio/jisha',player.name);
                    }
                    else if (player.name.indexOf('dhs_')==0){ //代号杀角色有两个击杀语音
                        game.playAudio('..','extension','鸭子扩展/audio/jisha',player.name + [1,2].randomGet().toString());
                    }
                },
            };
        },
        precontent: function(){
            let empireConfig = {
                color: '#160D08',
            }
            game.addGroup('empire', '帝', '帝国', empireConfig);
            lib.groupnature.empire = 'metal';
            let xihanConfig = {
                color: '#990000',
            }
            game.addGroup('xihan', '西', '西汉', xihanConfig);
            lib.namePrefix.set("代号杀", {showName: "代号杀", color: '#FF2800'});
            lib.groupnature.xihan = 'soil';
            let xichuConfig = {
                color: "#0B6623",
            }
            game.addGroup("xichu", '楚', "西楚", xichuConfig);
            lib.groupnature.xichu = 'wood';
            //lib.character['dhs_xiaohe'].dieAudios = ["ext:鸭子扩展/audio/die/dhs_xiaohe1.mp3","ext:鸭子扩展/audio/die/dhs_xiaohe2.mp3"];
            //lib.characterSort.鸭子扩展
        },
        config: {},
        package: {
            character: { // 角色系统
                character: { ...characters },
                characterSort: {
                    鸭子扩展: characterSort,
                },
                //characterReplace: { ...characterReplaces },
                translate: {
                    ...characterTranslates,
                    ...characterSortTranslate,
                }
            },
            skill: { // 技能系统
                skill: { ...skills },
                translate: {
                    ...skillTranslates,
                    ...voices,
                }
            },
            card: { // 卡牌系统
                card: {
                },
                translate: {
                },
                list: [],
            },
            intro: "一个闲鱼鸭子扩展，目前有很多代号杀武将和一两个私货。以后会增加更多。特别鸣谢：无名杀十周年样式群--无语，157，海边的ebao，在线求ol谋武将技能骨骼--无名杀频道--流年（无言），煩い煩い煩い--",
            author: "Plyasm",
            diskURL: "https://github.com/Plyasm/quackextension",
            forumURL: "",
            version: "0.7",
        },
        files: {
            "character": [],
            "skill": [], 
            "card": [],
            "audio": [],
        },
    };
});
            //"quack_tanya"         //谭雅：帝国，3血，技能：狙击，神佑，质神，善战。 狙击：锁定技。①出牌阶段开始时，你摸一张牌并将一张牌置于武将牌上，称为“弹”。②你使用【杀】时，若“弹”中有牌，你将一张“弹”置入弃牌堆。③你的武将牌上有“弹”时，你使用杀无距离限制。
            // 神佑：自带防御被动buff。出牌阶段限一次，当神佑标记>X， 可以弃置所有标记并造成大范围伤害。
            // 质神：当你于摸牌阶段外摸牌或造成伤害后，你获得1个“神佑”标记。出牌阶段限一次，你可以弃置X枚“神佑”标记，令X名其他角色获得【鼓舞】直到其下一个回合结束。
            // 善战：帝国势力技，当你使用或打出一张【杀】时，或受到伤害后，你可以摸一张牌。
            // 鼓舞：当你对一名角色造成伤害时，你摸一张牌。

            //"quack_mary"
            //玛丽·苏，合州国，3/4血，技能，神佑，狂热，祈祷，资援。
            // 神佑：自带防御被动buff。出牌阶段限一次，当神佑标记>X， 可以弃置所有标记并造成大范围伤害。
            // 狂热：锁定技。当你受到伤害或使用伤害类牌后，你观看牌堆顶的X+1张牌，并获得其中的Y张牌。
            // 祈祷：出牌阶段，你可以弃置所有手牌，然后摸弃置牌数量一半的牌（向下取整）并获得X个“神佑”标记。（X为本阶段你发动此技能的次数）
            // 资援：合州国势力技，当你于摸牌阶段外获得牌时，你可以将其中的至少一张牌交给一名没有【资援】的角色并摸一张牌。

            //"dhs_zuoci"   //代号杀左慈：东汉，1血，技能：掷杯戏曹，遁甲天书，飞升太虚。 掷杯戏曹：你使用牌指定其他角色为唯一目标时，可以额外指定1个虚假目标，该目标可以响应此牌（无效果）。
            // 遁甲天书：你的回合开始前，你从三名随机武将中选择一名，你获得其所有技能知道你的下回合开始。
            // 飞升太虚：游戏开始或回合开始时，你依次亮出牌顶的两张牌，你的体力值与手牌上限变为牌的点数。