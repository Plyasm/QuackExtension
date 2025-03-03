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
            "quack_visha": ["female", "empire", 4/4, ["ys_yanfu","ys_shanzhan"],[
                "des:维多莉亚·伊娃诺娃·谢列布里亚科夫少尉，又称维夏。谭雅的副官。",
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
        },
        translate: {
        },
    },
    intro: "",
    author: "Plyasm",
    diskURL: "",
    forumURL: "",
    version: "1.0",
},files:{"character":[],"card":[],"skill":[],"audio":[]},connect:false} 
};