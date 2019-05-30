let p1 = ()=>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve('p1')
        }, 1000)
    })
}
let p2 = ()=>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve('p2')
        }, 1000)
    })
}
let p3 = ()=>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            reject('p3')
        }, 1500)
    })
}
async function start(){
    try{
        let [a,b] = await Promise.all([p1(), p2()]);
        console.log(a, b);
        let c = await p3();
        console.log(c);
    }catch(err){
        console.log('err', err);
    }
}
start();