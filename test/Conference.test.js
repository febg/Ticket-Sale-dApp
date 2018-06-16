Conference = artifacts.require('Conference');
contract('Conference', async accounts => {
	
	it("Should assert quota to 50", async () => {
		let conference = await Conference.deployed();
		let quota = await conference.quota.call()
		assert.equal(quota, 50, "quota does not match")	
	})
	
	it("Should assert organizer address to accounts[0]", async () => {
		let conference = await Conference.deployed();
		let organizer = await conference.organizer.call();
		assert(organizer, accounts[0], "organizer address set incorrectlty")
	})

	it("Should assert initial number of registrants to 0", async () => {
		let conference = await Conference.deployed();
		let number_registrants = conference.number_registrants.call();
		assert(number_registrants, 0, "number of initials registrants does not match 0");
	})

	it("Should buy a ticket from the conference", async () => {
		let account_two = accounts[1];
		let conference = await Conference.deployed();
		let ticket_price = web3.toWei(.05, 'ether');
		let starting_number_registrants = await conference.number_registrants.call();
		let conference_starting_balance = web3.eth.getBalance(conference.address).toNumber();
		let account_two_starting_balance = web3.eth.getBalance(account_two).toNumber();
		let ticket = await conference.buyTicket( { from: account_two, value: ticket_price } );	
		let conference_ending_balance = web3.eth.getBalance(conference.address).toNumber();
		let account_two_ending_balance = web3.eth.getBalance(account_two).toNumber();
		assert(ticket, true, "unable to buy ticket");
		assert(conference_ending_balance, conference_starting_balance + ticket_price, "ticket compensation not added to contract wallet correctyl")
		assert(account_two_ending_balance, account_two_starting_balance - ticket_price);
		let account_two_transaction_record = await conference.registrantsPaid.call(account_two);
		assert(account_two_transaction_record, ticket_price, "transaction record for ticket purchase not set correctly");
		let number_registrants = await conference.number_registrants.call();
		assert(number_registrants, starting_number_registrants + 1, "number of registrants did not increased after transaction");
	})
		
})
