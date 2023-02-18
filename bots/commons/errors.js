class Error{
    constructor(m,s){
        this.message = m
        this.stop=s
    }
}

const sendError = (bot,owner,err) => {
    let treat = {
        
        "NO_PICKAXE":new Error("je n'ai pas de pioche sur moi !",true),
        "WRONG_ORIENTATION":new Error("Je n'ai pas compris l'orientation. Réessayez (nord/sud/est/ouest)",true),
        "TOO_FAR" : new Error("Tu es trop loin pour que je t'entende. Il faut que tu sois à une distance de 16 blocs.",true),
        "NOT_OWNER" :new Error("Tu n'es pas mon maitre !",false),
        "NO_AXE":new Error("je n'ai pas de hache sur moi !",true),
        "POSSIBLE_CAVE":new Error("il y a un vide, je ne peux pas continuer. C'est possiblement une caverne",true),
        "NOT_DIGGABLE" :new Error("Je ne peux pas casser ce bloc",true),
        "LAVA":new Error("Il y a de la lave !",false),
        "NO_SHOVEL":new Error("je n'ai pas de pelle sur moi !",true),
        "WRONG_REQUEST":new Error("je n'ai pas compris ce que tu veux. Verifie ta requete",true),
        "WRONG_LEVEL" : new Error("Je n'ai pas compris le nombre de couches que je dois descendre",true)
    }

    console.log(treat[err].message);
    bot.whisper(owner,treat[err].message);

    if(treat[err].stop)
        bot.state = "";
        bot.pathfinder.stop();
    
}

exports.sendError = sendError;