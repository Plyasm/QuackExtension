import { lib, game, ui, get, ai, _status } from "../../noname.js";
import characters from "./character.js";
import skills from "./skill.js";
//import characterReplaces from "./characterReplace.js";
import { characterSort, characterSortTranslate } from "./sort.js";
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
        // content: function(){
        //     lib.skill._entrancepeiyin={ //登场配音系统
        //         trigger:{
        //             player: "phaseBefore",
        //         },
        //         fixed:true,
        //         forced:true,
        //         unique:true,
        //         popup:false,
        //         lastDo:true,
        //         charlotte:true,
        //         superCharlotte:true,
        //         filter:function(event,player){
        //             return (event.player.name.indexOf('quack_')==0 || event.player.name.indexOf('dhs_')==0) && player.phaseNumber == 1;
        //         },
        //         content:function(event, trigger, player){
        //             if (event.player.name.indexOf('quack_')==0){
        //                 game.playAudio('..','extension','鸭子扩展/audio/entrance',trigger.player.name);
        //             }
        //             else if (event.player.name.indexOf('dhs_')==0){ //代号杀角色有两个登场语音
        //                 game.playAudio('..','extension','鸭子扩展/audio/entrance',trigger.player.name + [1,2].randomGet().toString());
        //             }
        //         },
        //     }
        // },
        // content: function(){
        //     lib.skill._entrancepeiyin={ //击杀配音系统
        //         trigger:{
        //             source: "dieAfter",
        //         },
        //         fixed:true,
        //         forced:true,
        //         unique:true,
        //         popup:false,
        //         lastDo:true,
        //         charlotte:true,
        //         superCharlotte:true,
        //         filter:function(event,player){
        //             return (event.player.name.indexOf('quack_')==0 || event.player.name.indexOf('dhs_')==0) && player.phaseNumber == 1;
        //         },
        //         content:function(event, trigger, player){
        //             if (event.player.name.indexOf('quack_')==0){
        //                 game.playAudio('..','extension','鸭子扩展/audio/jisha',trigger.player.name);
        //             }
        //             else if (event.player.name.indexOf('dhs_')==0){ //代号杀角色有两个击杀语音
        //                 game.playAudio('..','extension','鸭子扩展/audio/jisha',trigger.player.name + [1,2].randomGet().toString());
        //             }
        //         },
        //     }
        // },
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
                    "quack_visha": "维多莉亚",
                    "dhs_xiaohe": "代号杀萧何",
                    "dhs_xiaohe_prefix": "代号杀",
                    "#ext:鸭子扩展/audio/die/dhs_xiaohe1:die": "功未成，已作枯骨......",
                    "#ext:鸭子扩展/audio/die/dhs_xiaohe2:die": "社稷安危，又待托付何人？",
                    "dhs_zuoci": "代号杀左慈",
                    "dhs_zuoci_prefix": "代号杀",
                    "#ext:鸭子扩展/audio/die/dhs_zuoci1:die": "生也死之徒，死也生之始。",
                    "#ext:鸭子扩展/audio/die/dhs_zuoci2:die": "大道既成！",
                    "dhs_zhangliao": "代号杀张辽",
                    "dhs_zhangliao_prefix": "代号杀",
                    "#ext:鸭子扩展/audio/die/dhs_zhangliao1:die": "死则死耳，何惧之有！",
                    "#ext:鸭子扩展/audio/die/dhs_zhangliao2:die": "今虽就死，死得其所！",
                    "dhs_lvbu": "代号杀吕布",
                    "dhs_lvbu_prefix": "代号杀",
                    "#ext:鸭子扩展/audio/die/dhs_lvbu1:die": "吾岂能败？到黄泉再战！",
                    "#ext:鸭子扩展/audio/die/dhs_lvbu2:die": "大丈夫征战沙场，何惧一死？",
                    "dhs_xiangyu": "代号杀项羽",
                    "dhs_xiangyu_prefix": "代号杀",
                    "#ext:鸭子扩展/audio/die/dhs_xiangyu1:die": "骓不逝兮可奈何！",
                    "#ext:鸭子扩展/audio/die/dhs_xiangyu2:die": "天之亡我，我何渡为！",
                    ...characterSortTranslate
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
                    "dhs_chengyedraw_info": "锁定技，当你使用牌时，摸一张牌。",
                    "#dhs_baiye1": "忧患生于所忽，祸起于细微。",
                    "#dhs_baiye2": "阻其图，夺其虑，乘其惧。",
                    "#dhs_chengye1": "有力者疾以助人，有道者劝以教人。",
                    "#dhs_chengye2": "君子成人之美。",
                    "#dhs_chengyedraw1": "至如信者，国士无双。",
                    "#dhs_chengyedraw2": "令民得入田，毋收稿为禽兽食。",
                    "dhs_feishengtaixu": "飞升太虚",
                    "dhs_feishengtaixu_info": "锁定技：游戏开始或回合开始时，你依次亮出牌顶的两张牌，你的体力值与手牌上限依次变为亮出的点数。",
                    "#dhs_feishengtaixu1": "太虚寥廓，肇基化元，万物资始，五运终天。",
                    "#dhs_feishengtaixu2": "游鸾凭泰虚，腾鳞托浮宵。",
                    "dhs_zhibeixicao": "掷杯戏曹",
                    "dhs_zhibeixicao_info": "你使用牌指定其他角色为唯一目标时，可以额外指定一个虚假目标，该目标可以响应此牌（此牌对其无效果）。",
                    "#dhs_zhibeixicao1": "吉凶见，故善否著。虚实荡，故万物缠。",
                    "#dhs_zhibeixicao2": "等闲施设神仙术，点悟曹瞒不转头。",
                    "dhs_xiaoyaozhiti": "逍遥止啼",
                    "dhs_xiaoyaozhiti_info": "你的回合开始时，你可以获得一名其他角色的一张手牌并令其不能使用无懈可击直到本回合结束。",
                    "dhs_bailangchihui": "白狼持麾",
                    "dhs_bailangchihui_info": "你的回合开始时，你可以令一名角色获得〖白狼〗标记直到你的下回合开始。当有角色对有〖白狼〗标记的角色使用【杀】时，其摸一张牌。",
                    "dhs_bailangchihuimark": "白狼",
                    "dhs_bailangchihuimark_info": "锁定技，其他角色对你使用【杀】时，其摸一张牌。",
                    "dhs_xiaoyaozhitinowuxie": "止啼",
                    "dhs_xiaoyaozhitinowuxie_info": "锁定技，你无法使用无懈可击。",
                    "#dhs_xiaoyaozhiti1": "江东十万，吾亦来去自如。",
                    "#dhs_xiaoyaozhiti2": "铁骑踏江东，小儿岂敢啼？",
                    "#dhs_xiaoyaozhitinowuxie1": "折其盛势，以安众心，然后可守也。",
                    "#dhs_xiaoyaozhitinowuxie2": "处世不分轻重，非丈夫也。",
                    "#dhs_bailangchihui1": "主公授麾，勇者得前耳！",
                    "#dhs_bailangchihui2": "望麾而进，不闻令而擅前后左右者斩。",
                    "#dhs_bailangchihuimark1": "出言不逊，何不杀之！",
                    "dhs_wenhouwushuang": "温侯无双",
                    "dhs_wenhouwushuang_info": "锁定技。①当你获得锦囊牌后，将其转化为两张【杀】。②你的【杀】不可闪避。",
                    "dhs_langziyexin": "狼子野心",
                    "dhs_langziyexin_info": "当你使用【杀】造成伤害后，你可以令你攻击范围内的另一名其他角色交给你两张牌，否则你可以对其使用一张不计入出杀次数的【杀】。",
                    "dhs_yuanmensheji": "辕门射戟",
                    "dhs_yuanmensheji_info": "限定技，当其他角色成为【杀】的目标时，你可以打出一张【杀】，令此【杀】无效。",
                    "#dhs_wenhouwushuang1": "四海之内，唯我温侯独步！",
                    "#dhs_wenhouwushuang2": "山川草木，皆我兵刃。",
                    "#dhs_wenhouwushuang_qiangming1": "量你区区小卒，也敢螳臂当车？",
                    "#dhs_wenhouwushuang_qiangming2": "就凭尔等，也配与我一战？",
                    "#dhs_langziyexin1": "汉家城池，诸人有份，偏尔合得？",
                    "#dhs_langziyexin2": "向我俯首称臣，如何？",
                    "#dhs_langziyexinsubmit1": "霸业雄心吾自求之，岂为虚伪忠义所挟？",
                    "#dhs_langziyexinreject1": "十八路诸侯，吾视之为草芥。",
                    "#dhs_yuanmensheji1": "布平生不好斗，惟好解斗。",
                    "#dhs_yuanmensheji2": "吾箭既中，尔等即刻退兵！",
                    "dhs_bawang": "霸王",
                    "dhs_bawang_info": "锁定技。①当你使用【决斗】时，或者当其他角色对你使用【决斗】时，此决斗的效果改为你对对方造成1点伤害。②当你累计造成了3次伤害时，你从游戏外获得一张【决斗】。",
                    "dhs_pofuchenzhou": "破釜沉舟",
                    "dhs_pofuchenzhou_info": "限定技，出牌阶段，你可以将你所有牌（至少一张）移出游戏，摸三张牌且你本局游戏内造成的伤害+1，出牌阶段使用【杀】的次数上限+1。",
                    "#dhs_bawang1": "始皇又如何。彼可取而代也！",
                    "#dhs_bawang2": "吾历七十余战，未尝败北。",
                    "#dhs_pofuchenzhou1": "破釜沉舟，百二秦关终属楚。",
                    "#dhs_pofuchenzhou2": "今以必死之心，求破敌之功。",
                    "#dhs_bawang_count1": "将相宁无种，本无富和穷。",
                    "#dhs_pofuchenzhoubuff1": "愿与汉王挑战，决雌雄!",
                    "dhs_bawang_count": '霸王',
                    "dhs_pofuchenzhoubuff": "破釜沉舟",
                    "dhs_pofuchenzhoubuff_info": "当你造成伤害时，此伤害+1。你出牌阶段使用【杀】的次数上限+1。",
                }
            },
            card: { // 卡牌系统
                card: {
                },
                translate: {
                },
                list: [],
            },
            intro: "一个闲鱼鸭子扩展，目前只有几个武将。以后会增加更多。",
            author: "Plyasm",
            diskURL: "https://github.com/Plyasm/quackextension",
            forumURL: "",
            version: "0.4FIX",
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