import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { createDraft, draftOptions, getOptions, reset, getTurn } from './routes';


describe('routes', function() {
  it('createDraft', function() {
    //testing currentUser is undefined name
    const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/createDraft', query: {}, body: {name: "TeamA\nTeamB", options: "Lebron\nKobe\nCurry\nJimmy", currUser: undefined, round: "4"}}
    );
    const res1 = httpMocks.createResponse();
    createDraft(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);

    //testing currentuser is not type of string
    const req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/createDraft', query: {}, body: {name: "TeamA\nTeamB", options: "Lebron\nKobe\nCurry\nJimmy", currUser: 45, round: "4"}}
    );
    const res2 = httpMocks.createResponse();
    createDraft(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);

    //testing options is undefined
    const req3 = httpMocks.createRequest(
      {method: 'POST', url: '/api/createDraft', query: {}, body: {name: "TeamA\nTeamB", options: undefined, currUser: "TeamA", round: "4"}}
    );
    const res3 = httpMocks.createResponse();
    createDraft(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);

    //testing options is not type of string
    const req4 = httpMocks.createRequest(
      {method: 'POST', url: '/api/createDraft', query: {}, body: {name: "TeamA\nTeamB", options: 42, currUser: "TeamA", round: "4"}}
    );
    const res4 = httpMocks.createResponse();
    createDraft(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 400);

    //Testing if name is undefined
    const req5 = httpMocks.createRequest(
      {method: 'POST', url: '/api/createDraft', query: {}, body: {name: undefined, options: "Lebron\nKobe\nCurry\nJimmy", currUser: "TeamA", round: "4"}}
    );
    const res5 = httpMocks.createResponse();
    createDraft(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 400);

    //Testing if name is not type of string
    const req6 = httpMocks.createRequest(
      {method: 'POST', url: '/api/createDraft', query: {}, body: {name: 45, options: "Lebron\nKobe\nCurry\nJimmy", currUser: "TeamA", round: "4"}}
    );
    const res6 = httpMocks.createResponse();
    createDraft(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 400);

    //Testing if Current User is empty
    const req7 = httpMocks.createRequest(
      {method: 'POST', url: '/api/createDraft', query: {}, body: {name: "TeamA\nTeamB", options: "Lebron\nKobe\nCurry\nJimmy", currUser: "", round: "4"}}
    );
    const res7 = httpMocks.createResponse();
    createDraft(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 400);
    //Testing if name is empty
    const req8 = httpMocks.createRequest(
      {method: 'POST', url: '/api/createDraft', query: {}, body: {name: "", options: "Lebron\nKobe\nCurry\nJimmy", currUser: "TeamA", round: "4"}}
    );
    const res8 = httpMocks.createResponse();
    createDraft(req8, res8);
    assert.strictEqual(res8._getStatusCode(), 400);

    //Testing if options is empty
    const req9 = httpMocks.createRequest(
      {method: 'POST', url: '/api/createDraft', query: {}, body: {name: "TeamA\nTeamB", options: "", currUser: "TeamA", round: "4"}}
    );
    const res9 = httpMocks.createResponse();
    createDraft(req9, res9);
    assert.strictEqual(res9._getStatusCode(), 400);

    //Testing if Rounds is undefined
    const req10 = httpMocks.createRequest(
      {method: 'POST', url: '/api/createDraft', query: {}, body: {name: "TeamA\nTeamB", options: "Lebron\nKobe\nCurry\nJimmy", currUser: "TeamA", round: undefined}}
    );
    const res10 = httpMocks.createResponse();
    createDraft(req10, res10);
    assert.strictEqual(res10._getStatusCode(), 400);

    //Testing if Rounds is not typeof string
    const req11 = httpMocks.createRequest(
      {method: 'POST', url: '/api/createDraft', query: {}, body: {name: "TeamA\nTeamB", options: "Lebron\nKobe\nCurry\nJimmy", currUser: "TeamA", round: 32}}
    );
    const res11 = httpMocks.createResponse();
    createDraft(req11, res11);
    assert.strictEqual(res11._getStatusCode(), 400);

    //Checking if Rounds is empty
    const req12 = httpMocks.createRequest(
      {method: 'POST', url: '/api/createDraft', query: {}, body: {name: "TeamA\nTeamB", options: "Lebron\nKobe\nCurry\nJimmy", currUser: "TeamA", round: "0"}}
    );
    const res12 = httpMocks.createResponse();
    createDraft(req12, res12);
    assert.strictEqual(res12._getStatusCode(), 400);
    
      
    //Testing if size of drafters is greater than current options.
    const req14 = httpMocks.createRequest(
      {method: 'POST', url: '/api/createDraft', query: {}, body: {name: "TeamA\nTeamB", options: "Lebron", currUser: "TeamA", round: "1"}}
    )
    const res14 = httpMocks.createResponse();
    createDraft(req14, res14);
    assert.strictEqual(res14._getStatusCode(), 400);
    
    //Testing normal createDraft
    const req15 = httpMocks.createRequest(
      {method: 'POST', url: '/api/createDraft', query: {}, body: {name: "TeamA\nTeamB", options: "Lebron\nKobe\nCurry\nJimmy", currUser: "TeamA", round: "2"}}
    );
    const res15 = httpMocks.createResponse();
    createDraft(req15, res15);
    assert.strictEqual(res15._getStatusCode(), 200);
    assert.deepEqual(res15._getJSONData(), "1");
    
    reset();
  });

  it('draftOptions', function() {
    //constructing drafts
    const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/createDraft', query: {}, body: {name: "TeamA\nTeamB", options: "Lebron\nKobe\nCurry\nDurant", currUser: "TeamA", round: "2"}}
    )
    const res1 = httpMocks.createResponse();
    createDraft(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);

    //constructing drafts
    const req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/createDraft', query: {}, body: {name: "TeamC\nTeamD", options: "Michael\nKobe\nJeremy\nDurant", currUser: "TeamC", round: "2"}}
    )
    const res2 = httpMocks.createResponse();
    createDraft(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);

    //Testing if options is undefined
    const req3 = httpMocks.createRequest(
      {method: 'POST', url: '/api/draftOptions', query: {}, body: {name: "TeamA", options: undefined, key: "1"}}
    )
    const res3 = httpMocks.createResponse();
    draftOptions(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);

    //Testing if options is not type of string
    const req4 = httpMocks.createRequest(
      {method: 'POST', url: '/api/draftOptions', query: {}, body: {name: "TeamA", options: 12, key: "1"}}
    )
    const res4 = httpMocks.createResponse();
    draftOptions(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 400);

    //Testing if name is undefined
    const req5 = httpMocks.createRequest(
      {method: 'POST', url: '/api/draftOptions', query: {}, body: {name: undefined, options: "Lebron", key: "1"}}
    )
    const res5 = httpMocks.createResponse();
    draftOptions(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 400);

    //Testing if name is not typeof string
    const req6 = httpMocks.createRequest(
      {method: 'POST', url: '/api/draftOptions', query: {}, body: {name: 12, options: "Lebron", key: "1"}}
    )
    const res6 = httpMocks.createResponse();
    draftOptions(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 400);

    //Testing if key is undefined
    const req7 = httpMocks.createRequest(
      {method: 'POST', url: '/api/draftOptions', query: {}, body: {name: "TeamA", options: "Lebron", key: undefined}}
    )
    const res7 = httpMocks.createResponse();
    draftOptions(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 400);

    //Testing if key is not typeof String
    const req8 = httpMocks.createRequest(
      {method: 'POST', url: '/api/draftOptions', query: {}, body: {name: "TeamA", options: "Lebron", key: 3}}
    )
    const res8 = httpMocks.createResponse();
    draftOptions(req8, res8);
    assert.strictEqual(res8._getStatusCode(), 400);

    //Testing that key is not valid within the draft error
    const req9 = httpMocks.createRequest(
      {method: 'POST', url: '/api/draftOptions', query: {}, body: {name: "TeamA", options: "Lebron", key: "4"}}
    )
    const res9 = httpMocks.createResponse();
    draftOptions(req9, res9);
    assert.strictEqual(res9._getStatusCode(), 400);

    //Checks if option selected is not within the map error
    const req10 = httpMocks.createRequest(
      {method: 'POST', url: '/api/draftOptions', query: {}, body: {name: "TeamA", options: "random", key: "1"}}
    )
    const res10 = httpMocks.createResponse();
    draftOptions(req10, res10);
    assert.strictEqual(res10._getStatusCode(), 400);

    //Checks if name is not within the map error
    const req11 = httpMocks.createRequest(
      {method: 'POST', url: '/api/draftOptions', query: {}, body: {name: "TeamC", options: "Lebron", key: "1"}}
    )
    const res11 = httpMocks.createResponse();
    draftOptions(req11, res11);
    assert.strictEqual(res11._getStatusCode(), 400);

    //Testing normal runs
    const req12 = httpMocks.createRequest(
      {method: 'POST', url: '/api/draftOptions', query: {}, body: {name: "TeamA", options: "Lebron", key: "1"}}
    )
    const res12 = httpMocks.createResponse();
    draftOptions(req12, res12);
    assert.strictEqual(res12._getStatusCode(), 200);
    assert.deepEqual(res12._getJSONData(), [{name: "TeamA", option: "Lebron"}]);

    const req13 = httpMocks.createRequest(
      {method: 'POST', url: '/api/draftOptions', query: {}, body: {name: "TeamB", options: "Kobe", key: "1"}}
    )
    const res13 = httpMocks.createResponse();
    draftOptions(req13, res13);
    assert.strictEqual(res13._getStatusCode(), 200);
    assert.deepEqual(res13._getJSONData(), [{name: "TeamA", option: "Lebron"}, {name: "TeamB", option: "Kobe"}]);

    const req14 = httpMocks.createRequest(
      {method: 'POST', url: '/api/draftOptions', query: {}, body: {name: "TeamC", options: "Kobe", key: "2"}}
    )
    const res14 = httpMocks.createResponse();
    draftOptions(req14, res14);
    assert.strictEqual(res14._getStatusCode(), 200);
    assert.deepEqual(res14._getJSONData(), [{name: "TeamC", option: "Kobe"}]);

    reset();
  });

  it('getOptions', function() {
    //constructing drafts
    const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/createDraft', query: {}, body: {name: "TeamA\nTeamB", options: "Lebron\nKobe\nCurry\nDurant", currUser: "TeamA", round: "2"}}
    )
    const res1 = httpMocks.createResponse();
    createDraft(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);

    //constructing drafts
    const req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/createDraft', query: {}, body: {name: "TeamC\nTeamD", options: "Michael\nKobe\nJeremy\nDurant", currUser: "TeamC", round: "2"}}
    )
    const res2 = httpMocks.createResponse();
    createDraft(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);

    //testing if key is undefined
    const req3 = httpMocks.createRequest(
      {method: 'GET', url: '/api/getOptions', query: {key: undefined}});
    const res3 = httpMocks.createResponse();
    getOptions(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);

    //testing if key is not typeof string
    const req4 = httpMocks.createRequest(
      {method: 'GET', url: '/api/getOptions', query: {key: 1}});
    const res4 = httpMocks.createResponse();
    getOptions(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 400);

    //testing key is not valid within map
    const req5 = httpMocks.createRequest(
      {method: 'GET', url: '/api/getOptions', query: {key: "40"}});
    const res5 = httpMocks.createResponse();
    getOptions(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 400);

    //testing regular inputs
    const req6 = httpMocks.createRequest(
      {method: 'GET', url: '/api/getOptions', query: {key: "1"}});
    const res6 = httpMocks.createResponse();
    getOptions(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 200);
    assert.deepEqual(res6._getJSONData(), '["Lebron","Kobe","Curry","Durant"]');
    
    const req7 = httpMocks.createRequest(
      {method: 'GET', url: '/api/getOptions', query: {key: "2"}});
    const res7 = httpMocks.createResponse();
    getOptions(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 200);
    assert.deepEqual(res7._getJSONData(), '["Michael","Kobe","Jeremy","Durant"]');

    reset();
  });

  it('getTurn', function() {
    //constructing drafts
    const req1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/createDraft', query: {}, body: {name: "TeamA\nTeamB", options: "Lebron\nKobe\nCurry\nDurant", currUser: "TeamA", round: "2"}}
    )
    const res1 = httpMocks.createResponse();
    createDraft(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);

    //constructing drafts
    const req2 = httpMocks.createRequest(
      {method: 'POST', url: '/api/createDraft', query: {}, body: {name: "TeamC\nTeamD", options: "Michael\nKobe\nJeremy\nDurant", currUser: "TeamC", round: "2"}}
    )
    const res2 = httpMocks.createResponse();
    createDraft(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 200);

    //testing if key is undefined
    const req3 = httpMocks.createRequest(
      {method: 'GET', url: '/api/getTurn', query: {key: undefined}});
    const res3 = httpMocks.createResponse();
    getTurn(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);

    //testing if key is not typeof string
    const req4 = httpMocks.createRequest(
      {method: 'GET', url: '/api/getTurn', query: {key: 1}});
    const res4 = httpMocks.createResponse();
    getTurn(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 400);

    //testing key is not valid within map
    const req5 = httpMocks.createRequest(
      {method: 'GET', url: '/api/getTurn', query: {key: "40"}});
    const res5 = httpMocks.createResponse();
    getTurn(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 400);

    //calling draft to construct whose picked soFar
    const req7 = httpMocks.createRequest(
    {method: 'POST', url: '/api/draftOptions', query: {}, body: {name: "TeamA", options: "Lebron", key: "1"}}
    )
    const res7 = httpMocks.createResponse();
    draftOptions(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 200);
    
    //Testing getTurn to switch turns and return also whose picked so Far
    const req6 = httpMocks.createRequest(
      {method: 'GET', url: '/api/getTurn', query: {key: "1"}});
    const res6 = httpMocks.createResponse();
    getTurn(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 200);
    assert.deepEqual(res6._getJSONData(), '{"soFar":[{"name":"TeamA","option":"Lebron"}],"isTurn":"TeamB"}');
    
    //continues to draft another person from the key: 1
    const req8 = httpMocks.createRequest(
      {method: 'POST', url: '/api/draftOptions', query: {}, body: {name: "TeamB", options: "Curry", key: "1"}}
      )
    const res8 = httpMocks.createResponse();
    draftOptions(req8, res8);
    assert.strictEqual(res8._getStatusCode(), 200);

    //Testing again to see if getTurns switches player returned and also returns whose picked soFar
    const req9 = httpMocks.createRequest(
      {method: 'GET', url: '/api/getTurn', query: {key: "1"}});
    const res9 = httpMocks.createResponse();
    getTurn(req9, res9);
    assert.strictEqual(res9._getStatusCode(), 200);
    assert.deepEqual(res9._getJSONData(), '{"soFar":[{"name":"TeamA","option":"Lebron"},{"name":"TeamB","option":"Curry"}],"isTurn":"TeamA"}');
      
    reset();
  });
});
