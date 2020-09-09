const ext = {
    telIndex: 0,
    telArr: [],
    addText: '',
    hasTwoWx: false,
    launch() {
        console.show()
        console.log('执行脚本')

        ext.getTels()

        console.log('启动企业微信')
        app.launchApp('企业微信')

        console.log('进入搜索页面')
        sleep(1000)
        id('hk9').click()
        ext.search()
    },
    exit(info) {
        dialogs.alert(info, '', () => {
            console.log('停止脚本')
            ext.telIndex = 0;
            ext.hasTwoWx = false;
            threads.shutDownAll()
        })
    },
    getTels() {
        let hasTels = files.isFile('/sdcard/tels.json')

        if (hasTels) {
            console.log('读取tels.json文件')
            let jsonStr = files.read('/sdcard/tels.json')
            let json = JSON.parse(jsonStr)

            if (json.addText && typeof json.addText === 'string') {
                ext.addText = json.addText
                console.log(ext.addText)
            } else {
                console.log('没有addText字段')
                ext.exit('没有addText')
            }

            if (json.tels && json.tels.length > 0) {
                ext.telArr = json.tels
                console.log(ext.telArr)
            } else {
                console.log('没有telArr字段或telArr为空')
                ext.exit('没有telArr')
            }

        } else {
            console.log('没有检测到tels.json文件')
            ext.exit('没有检测到tels.json文件')
        }
    },
    search() {
        if (ext.telArr.length == 0) {
            console.log('空的手机号')
            ext.exit('空的手机号')
        } else if (ext.telArr[ext.telIndex]) {
            console.log('查询 -> ' + ext.telArr[ext.telIndex])
            id('g75').setText(ext.telArr[ext.telIndex])

            ext.telIndex++

            sleep(1000)
            ext.searchResult()
        } else {
            console.log('全部执行完毕')
            sleep(1000)
            id('hjo').waitFor()
            id('hjo').click()
            ext.exit('全部执行完毕')
        }
    },
    searchResult() {
        sleep(500)
        let g8l = id('g8l').findOne().children()
        if (g8l.length) {
            console.log('获取查询结果')
            sleep(1000)
            g8l[g8l.length - 1].click()

            ext.readyAdd()
        } else {
            ext.searchResult()
        }
    },
    readyAdd() {
        sleep(500)
        if (id('gp').exists()) {
            sleep(1000)
            console.log('准备申请')
            id('gp').click()
            ext.add()
        } else if (id('ag7').exists()) {
            if (id('ag8').exists()) {
                console.log('联系人已存在')
                console.log('执行下一个手机号')
                sleep(1000)
                id('hjo').click()
                sleep(1000)
                id('hjo').click()
                ext.search()
            } else {
                console.log('准备申请')
                id('ag7').click()
                sleep(1000)
                ext.add()
            }
        } else if (id('bng').exists()) {
            console.log('对方同时使用微信和企业微信')
            id('bng').click()
            ext.hasTwoWx = true;
            ext.readyAdd()
        } else if (id('bfe').exists()) {
            sleep(1000)
            console.log('用户不存在')
            console.log('执行下一个手机号')
            id('bfe').click()
            sleep(3000)
            ext.search()
        } else {
            ext.readyAdd()
        }
    },
    add() {
        id('af8').click()
        sleep(1000)
        console.log('设置申请信息')
        id('af9').setText(ext.addText)
        sleep(1000)

        console.log('发送好友申请')
        id('cvc').waitFor()
        id('cvc').click()

        sleep(2000)
        id('hjo').waitFor()
        id('hjo').click()

        if (ext.hasTwoWx) {
            sleep(1000)
            id('hjo').waitFor()
            id('hjo').click()
            ext.hasTwoWx = false;
        }

        console.log('执行下一个手机号')
        sleep(3000)
        ext.search()
    }
}

module.exports = ext
