
function add(a,b=1){return a+b};  
console.log(add(1,1));  //2


let target = {
    name:'target'
}
let bb = new Proxy(target, {
    set(tarpTarget, key, value, receiver) {
        console.log('asdasdas');
		tarpTarget[key] = value;
    },
    get(tarpTarget, key, receiver) {
        console.log('sdfsdfsdfsf');
        return 1111;
		// return tarpTarget[key];
    }
});

let proxy = new Proxy(target, {
    set(tarpTarget, key, value, receiver) {
		tarpTarget[key] = value;
    },
    get(tarpTarget, key, receiver) {
        console.log('asdasdas', bb.aa);
        return 1111;
		// return tarpTarget[key];
    }
});

console.log(proxy.msg);