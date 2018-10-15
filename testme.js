function resolveLater() {
    return new Promise(resolve => {
        setTimeout( () => {
            return 1
        }), 15000
    })
}

async function testCall() {

    const i = await resolveLater();
    console.log(i)

}

testCall()
