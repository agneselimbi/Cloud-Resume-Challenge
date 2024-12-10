describe("test api", ()=>{
    it('test get resource', ()=>{
        cy.request('GET',Cypress.env('GET_API_URL'))
        .then((response)=>{
            expect(Cypress.env('GET_API_URL')).to.exist;
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
        let initialVisitorCount;
        // Ensure environment variables exist
       // expect(Cypress.env('POST_API_URL')).to.exist;
        expect(Cypress.env('GET_API_URL')).to.exist;
    
        // Initial GET Request
    cy.request('GET', Cypress.env('GET_API_URL'))
    .then((getResponse) => {
        // Validate the status code
        expect(getResponse.status).to.eq(200);

        // Validate the response body
        expect(getResponse.body).to.have.property('total_visitor_count');
        initialVisitorCount = getResponse.body.total_visitor_count;

        // Perform POST Request
        return cy.request('POST', Cypress.env('POST_API_URL'));
    })
    .then((postResponse) => {
        // Validate the POST response
        expect(postResponse.status).to.eq(200);

        // Validate the message
        const validMessages = [
            "Visitor count already updated",
            "Visitor added to table succesfully !"
        ];
        expect(validMessages).to.include(postResponse.body.message);

        // Second GET Request to verify ncremented  visitor count
        return cy.request('GET', Cypress.env('GET_API_URL'));
    })
    .then((getResponseAfterPost) => {
        // Validate the status code
        expect(getResponseAfterPost.status).to.eq(200);

        // Validate the visitor count remains consistent
        expect(getResponseAfterPost.body.total_visitor_count).to.eq(initialVisitorCount+1);

        // Third GET request to verify you can't update visitor count
        return cy.request('GET', Cypress.env('GET_API_URL'));
    })
    .then((secondgetResponse) => {
        // Validate the status code
        expect(secondgetResponse.status).to.eq(200);

        // Validate the visitor count remains consistent
        expect(secondgetResponse.body.total_visitor_count).to.eq(initialVisitorCount+1);
    });

    });

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
