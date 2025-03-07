import { lib, game, ui, get, ai, _status } from "../../noname.js";
import characters from "./character.js";
import skills from "./skill.js";
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
            //lib.character['dhs_xiaohe'].dieAudios = ["ext:鸭子扩展/audio/die/dhs_xiaohe1.mp3","ext:鸭子扩展/audio/die/dhs_xiaohe2.mp3"];
        },
        config: {},
        package: {
            character: { // 角色系统
                character: { ...characters },
                translate: {
                    "quack_visha": "维多莉亚",
                    "dhs_xiaohe": "代号杀萧何",
                    "dhs_xiaohe_prefix": "代号杀",
                    "#ext:鸭子扩展/audio/die/dhs_xiaohe1:die": "功未成，已作枯骨......",
                    "#ext:鸭子扩展/audio/die/dhs_xiaohe2:die": "社稷安危，又待托付何人？",
                    "dhs_zuoci": "代号杀左慈",
                    "dhs_zuoci_prefix": "代号杀",
                    "#ext:鸭子扩展/audio/die/dhs_zuoci1:die": "生也死之徒，死也生之始。",
                    "#ext:鸭子扩展/audio/die/dhs_zuoci2:die": "大道既成！"
                }
            },
            skill: { // 技能系统
                skill: { ...skills },
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
                    "dhs_feishengtaixu": "飞升太虚",
                    "dhs_feishengtaixu_info": "锁定技：游戏开始或回合开始时，你依次亮出牌顶的两张牌，你的体力值与手牌上限依次变为亮出的点数。",
                    "#dhs_feishengtaixu1": "太虚寥廓，肇基化元，万物资始，五运终天。",
                    "#dhs_feishengtaixu2": "游鸾凭泰虚，腾鳞托浮宵。"
                }
            },
            card: { // 卡牌系统
                card: {
                },
                translate: {
                },
                list: [],
            },
            intro: "一个闲鱼鸭子扩展，目前只有维多莉亚，和代号杀的萧何。以后会增加更多。",
            author: "Plyasm",
            diskURL: "https://github.com/Plyasm/quackextension",
            forumURL: "",
            version: "0.3a",
        },
        files: {
            "character": [],
            "skill": [], 
            "card": [],
            "audio": [],
        },
    };
});
/* export const type = "extension";
export default function(){
	return {name:"鸭子扩展",arenaReady:function(){
    
},content:function(config,pack){ */
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
    //lib.character["dhs_xiaohe"].dieAudios = ["ext:鸭子扩展/audio/die/dhs_xiaohe1.mp3","ext:鸭子扩展/audio/die/dhs_xiaohe2.mp3"];
    //lib.translate["#ext:鸭子扩展/audio/die/dhs_xiaohe1"] = "功未成，已作枯骨......";
    //lib.translate["#ext:鸭子扩展/audio/die/dhs_xiaohe2"] = "社稷安危，又待托付何人？";
    /* lib.character["dhs_xiaohe"].dieAudios = {
        dhs_xiaohe: [
            "ext:鸭子扩展/audio/die/dhs_xiaohe1.mp3",
            "ext:鸭子扩展/audio/die/dhs_xiaohe2.mp3"
        ]
    };
    lib.translate["#ext:鸭子扩展/audio/die/dhs_xiaohe1"] = "功未成，已作枯骨......";
    lib.translate["#ext:鸭子扩展/audio/die/dhs_xiaohe2"] = "社稷安危，又待托付何人？"; */
/* },prepare:function(){
    
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
                "die:ext:鸭子扩展/audio/die/quack_visha.mp3"
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
            *//* 
           "dhs_xiaohe":["male", "xihan", "4/4", ["dhs_chengye", "dhs_baiye"],[
                "des:代号杀萧何。",
                "ext:鸭子扩展/image/character/dhs_xiaohe.jpg",
                "die:ext:鸭子扩展/audio/die/dhs_xiaohe:2",
                //'die:ext:鸭子扩展/audio/die/dhs_xiaohe2.mp3'
            ]],
        },
        translate: {
            "quack_visha": "维多莉亚",
            "dhs_xiaohe": "代号杀萧何",
            //"dhs_xiaohe:die": "功未成，已作枯骨......",
            "#ext:鸭子扩展/audio/die/dhs_xiaohe:die": '功未成，已作枯骨......',
            "#ext:鸭子扩展/audio/die/dhs_xiaohe2:die": '社稷安危，又待托付何人？',
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
    
    intro: "一个闲鱼鸭子扩展，目前只有维多莉亚，和代号杀的萧何。以后会增加更多。",
    author: "Plyasm",
    diskURL: "https://github.com/Plyasm/quackextension",
    forumURL: "",
    version: "0.2b",
},files:{"character":[],"card":[],"skill":[],"audio":[]},connect:false} 
}; */