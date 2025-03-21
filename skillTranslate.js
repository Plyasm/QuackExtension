const translates = {
    //维多利亚
    "ys_yancong": "严从",
    "ys_yancong_info": "每回合每名角色限一次。其他角色使用杀或普通锦囊牌结算完毕后，你可以弃置X张牌，视为对其中一名目标角色使用一张无视距离的【杀】（X为此牌目标角色数）。若此【杀】没有造成伤害，你受到一点伤害并获得目标角色区域内的一张牌。",
    "ys_shanzhan": "善战",
    "ys_shanzhan_info": "帝国势力技，当你使用或打出一张【杀】时，或受到伤害后，你可以摸一张牌。",
    "ys_qiangshi": "强食",
    "ys_qiangshi_info": "锁定技。①当你回复体力时，你弃置一张手牌，令此次回复值+1。②每轮限一次，一名角色回合结束时，若你本回合弃置牌数不少于你体力值，你从弃牌堆中获得一张【桃】。",
    //萧何
    "dhs_baiye": "败也",
    "dhs_baiye_info": "限定技，其他角色出牌阶段结束时，若其在此阶段内使用过的牌数大于三张，你可以令一名除其以外的其他角色对其依次使用手牌中的所有【杀】，直到其进入濒死状态。",
    "dhs_chengye": "成也",
    "dhs_chengye_info": "回合结束时，你可以令一名其他角色立即进行一个只有出牌阶段的额外回合，且此阶段其使用牌时，其摸一张牌。",
    "dhs_chengyedraw": "成也",
    "dhs_chengyedraw_info": "锁定技，当你使用牌时，摸一张牌。",
    //左慈
    "dhs_feishengtaixu": "飞升",
    "dhs_feishengtaixu_info": "锁定技：游戏开始或回合开始时，你依次亮出牌顶的两张牌，你的体力值与手牌上限依次变为亮出的点数。",
    "dhs_zhibeixicao": "掷杯",
    "dhs_zhibeixicao_info": "你使用牌指定其他角色为唯一目标时，可以额外指定一个虚假目标，该目标可以响应此牌（此牌对其无效果）。",
    //张辽
    "dhs_xiaoyaozhiti": "止啼",
    "dhs_xiaoyaozhiti_info": "你的回合开始时，你可以获得一名其他角色的一张手牌并令其不能使用无懈可击直到本回合结束。",
    "dhs_bailangchihui": "白狼",
    "dhs_bailangchihui_info": "你的回合开始时，你可以令一名角色获得〖白狼〗标记直到你的下回合开始。当有角色对有〖白狼〗标记的角色使用【杀】时，其摸一张牌。",
    "dhs_bailangchihuimark": "白狼",
    "dhs_bailangchihuimark_info": "锁定技，其他角色对你使用【杀】时，其摸一张牌。",
    "dhs_xiaoyaozhitinowuxie": "止啼",
    "dhs_xiaoyaozhitinowuxie_info": "锁定技，你无法使用无懈可击。",
    //吕布
    "dhs_wenhouwushuang": "无双",
    "dhs_wenhouwushuang_info": "锁定技。①当你获得锦囊牌后，将其转化为两张【杀】。②你的【杀】不可闪避。",
    "dhs_langziyexin": "狼心",
    "dhs_langziyexin_info": "当你使用【杀】造成伤害后，你可以令你攻击范围内的另一名其他角色交给你两张牌，否则你可以对其使用一张无次数限制的【杀】。",
    "dhs_yuanmensheji": "射戟",
    "dhs_yuanmensheji_info": "限定技，当其他角色成为【杀】的目标时，你可以打出一张【杀】，令此【杀】无效。",
    //项羽
    "dhs_bawang": "霸王",
    "dhs_bawang_info": "锁定技。①当你使用【决斗】时，或者当其他角色对你使用【决斗】时，此决斗的效果改为你对对方造成1点伤害。②当你累计造成了3次伤害时，你从游戏外获得一张【决斗】。",
    "dhs_pofuchenzhou": "破釜",
    "dhs_pofuchenzhou_info": "限定技，出牌阶段，你可以将你所有牌（至少一张）移出游戏，摸三张牌且你本局游戏内造成的伤害+1，出牌阶段使用【杀】的次数上限+1。",
    "dhs_bawang_count": '霸王',
    "dhs_pofuchenzhoubuff": "破釜沉舟",
    "dhs_pofuchenzhoubuff_info": "当你造成伤害时，此伤害+X。你出牌阶段使用【杀】的次数上限+X。（X为你发动〖破釜〗的次数）",
    //孙策
    "dhs_hujvyingyang": "鹰扬",
    "dhs_hujvyingyang_info": "锁定技，摸牌阶段，你额外摸X张牌（X为你已损失的体力值）。",
    "dhs_xiaobawang": "激昂",
    "dhs_xiaobawang_info": "出牌阶段或弃牌阶段开始时，若你的手牌数为全场最多，你可以视为对一名其他角色使用一张【决斗】。",
    //孙尚香
    "dhs_xiaojiniangniang": "枭姬",
    "dhs_xiaojiniangniang_info": "锁定技。①游戏开始时，你选择两个装备类别（可以是同一种）并获得相对应的额外装备栏。②当你使用装备牌后，你摸一张牌。③当你失去一张装备区内的牌后，你摸一张牌。",
    "dhs_daojianqingyuan": '情缘',
    "dhs_daojianqingyuan_info": "每回合限一次。出牌阶段，你可以选择一名男性角色并弃置一张牌。你与其各回复1点体力，若有角色已经满体力，其从牌堆中获得一张装备牌。",
    //陆逊
    "dhs_huoshaolianying": "连营",
    "dhs_huoshaolianying_info": "每回合限一次。出牌阶段，你可以选择一名其他角色并交给其一张手牌，然后将其所有于此牌花色相同的牌移出游戏。若以此法移出了其至少三张牌，你对其造成1点火焰伤害。",
    "dhs_jieyigongwu": '共舞',
    "dhs_jieyigongwu_info": '锁定技，当你使用或打出手牌后，若你手牌数为全场最少，你摸一张牌。',
    //甘宁
    "dhs_bairenyexi": '夜袭',
    "dhs_bairenyexi_info": '当你获得黑桃牌后，你可以弃置一名其他角色区域里的一张牌。',
    "dhs_jinfanyouxia": '锦帆',
    "dhs_jinfanyouxia_info": "每回合限一次。出牌阶段，你可以将所有手牌花色转化为黑桃并随机置入牌堆，然后摸等量的牌。",
    //周瑜
    "dhs_xiongziyingfa": "雄姿",
    "dhs_xiongziyingfa_info": '锁定技，你的回合开始时，你摸两张牌。',
    "dhs_fanjianji": '反间',
    "dhs_fanjianji_info": "每回合限一次。当你成为其他角色使用的锦囊牌目标时，你可令此牌无效并令使用者收回此牌对应的所有实体牌，然后若其本回合再次使用或打出〖反间〗牌，其随机弃置两张牌并横置。",
    "dhs_huoshaochibi": "业火",
    "dhs_huoshaochibi_info": "出牌阶段开始时，你依次亮出牌顶的至多两张牌，若此牌点数为5，你可以弃置所有红桃手牌并对一名角色造成等量的火焰伤害，然后失去此技能。",
    //英布
    "dhs_gongguanzhuhou": '功冠',
    "dhs_gongguanzhuhou_info": "锁定技，每轮结束时，若你本轮造成的伤害值最高，你加1点体力上限，且你本局游戏内出牌阶段使用【杀】的次数上限+1。",
    "dhs_daxiguowang": '过望',
    "dhs_daxiguowang_info": "锁定技，每轮游戏开始时，你将手牌摸至X张（X为全场手牌数最多角色的手牌数）。",
    "dhs_gongguanzhuhoubuff": "功",
    "dhs_gongguanzhuhoubuff_info": '你出牌阶段使用【杀】的次数上限+X。（X为本局你满足〖功冠〗的次数）',
    //虞姬
    "dhs_meiren": "美人",
    "dhs_meiren_info": "锁定技，游戏开始时，你选择一名男性角色。你令其获得〖项郎〗，你获得〖虞娘〗。",
    "dhs_meirenhusband": "项郎",
    "dhs_meirenhusband_info": "锁定技，当〖虞娘〗受到伤害时，你将伤害转移给自己。",
    "dhs_meirenwife": "虞娘",
    "dhs_meirenwife_info": "锁定技，当〖项郎〗受到致命伤害时，防止此伤害且你失去等量的体力值，然后你令其回复1点体力。",
    "dhs_bawangbieji": "别姬",
    "dhs_bawangbieji_info": "锁定技，当你死亡时，立即结束当前回合并令执行下一个回合的角色为你指定的一名男性角色。（跳过中间所有非该角色的其他角色回合）",
    //吕雉
    "dhs_linchaochengzhi": "称制",
    "dhs_linchaochengzhi_info": '每名角色回合开始时，你可以选择一种花色并选择一项：令所有角色于本回合使用或打出此花色的牌后摸一张牌，或随机将一张牌移出游戏。',
};

export default translates;