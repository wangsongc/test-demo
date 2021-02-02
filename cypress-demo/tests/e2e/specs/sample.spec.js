describe('My first test case for cypress', function () {

    it('visit baidu home page and search for testerhome:', function () {
        cy.visit('http://www.baidu.com')//访问url
        cy.title().should('contain', '百度一下，你就知道')//验证页面 title 是否正确
        cy.get('#kw')//根据 css 定位搜索输入框
            .type('testerhome')//输入关键字
            .should('have.value', 'testerhome') //验证关键字自动是否展示正确
        cy.get('#su').click()  //根据 css 定位搜索按钮并点击
        cy.url().should('include', 'wd=testerhome') //验证目标url 是否正确包含关键字
        cy.title().should('contain', 'testerhome_百度搜索')  //验证页面 title 是否正确
        cy.get('[id="1"]')
            .should('contain', 'TesterHome')   // 验证第一个结果中是否包含TesterHome
        cy.screenshot()
    })
})