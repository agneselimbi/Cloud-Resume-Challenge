describe("test api", ()=>{
    it('test get resource', ()=>{
        cy.request('GET',Cypress.env('GET_API_URL'))
        .then((response)=>{
            //validate the status code 
            expect(response.status).to.eq(200);
            //validate the response body
            expect(response.body).to.have.property('total_visitor_count')
        });
        cy.request({
            method:'GET',
            url:"https://3hj9vc9684.execute-api.us-west-1.amazonaws.com/dev/getisitorCount",
            failOnStatusCode:false
        })
        .then((response) => {
            //validate the status code 
            expect(response.status).to.eq(403);
        });
    })
    
    it('test post resource', ()=>{
        cy.request('POST',Cypress.env('POST_API_URL'))
        .then((postresponse)=>{
            //validate the status code 
            expect(postresponse.status).to.eq(200);
            //validate ip address
            expect(postresponse.body).to.deep.eq({message:"Visitor added to table succesfully !"});
        });
        cy.request('GET',Cypress.env('GET_API_URL'))
        .then((getresponse)=>{
            //validate the status code 
            expect(getresponse.status).to.eq(200);
            //validate the response body
            expect(getresponse.body).to.have.property('total_visitor_count')
        });
        cy.request('POST',Cypress.env('POST_API_URL'))
        .then((postresponse1)=>{
            //validate the status code 
            expect(postresponse1.status).to.eq(200);
            //validate ip address
            expect(postresponse1.body).to.deep.eq({message: "Visitor count already updated"});  
        });
        cy.request('GET',Cypress.env('GET_API_URL'))
        .then((getresponse1)=>{
            //validate the status code 
            expect(getresponse1.status).to.eq(200);
            //validate the response body
            expect(getresponse1.body.total_visitor_count).to.eq(postresponse1.body.total_visitor_count)
        });
    })

    it("fail Post response", () =>{
        cy.request({
            method:'POST',
            url:"https://3hj9vc9684.execute-api.us-west-1.amazonaws.com/dev/incrementisitorCount",
            failOnStatusCode:false
        })
        .then((response) => {
            //validate the status code 
            expect(response.status).to.eq(403);
        });
    });

})
