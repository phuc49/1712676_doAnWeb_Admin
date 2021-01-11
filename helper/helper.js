
module.exports = {
    buildCondition: (condition,params,bt,field)=>{
        if(field){
            condition+=bt;
            params.push(field); 
        }
        return condition;
    }
}