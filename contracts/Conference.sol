pragma solidity 0.4.24;


contract Conference {

    address public organizer; // [ Owner ] Wallet address of the person that creates the contract
    mapping (address => uint) public registrantsPaid; 
    uint public number_registrants; //The number of people
    uint public quota; //The max number of people

// [ EVENTS ]
    event Deposit(address _from, uint _amount);
    event Refund (address _to, uint _amount);

// [ FUNCTIONS ]

// [  Constructor  ]
    
    constructor() {
        organizer = msg.sender;
        quota = 50;
        number_registrants = 0;	
    }

    function buyTicket() public payable returns (bool success) {
        if (number_registrants >= quota) {return;} //Needs to 'throw'
        registrantsPaid[msg.sender] = msg.value;
        number_registrants++;
        emit Deposit(msg.sender, msg.value);
        return true;
    }
	
    function refundTicket(address recipient, uint amount) public payable {
        if (msg.sender != organizer) { return; }
        if (registrantsPaid[recipient] == amount) {
            address myAddress = this;		
            if (myAddress.balance >= amount) {
                recipient.transfer(amount);
                registrantsPaid[recipient] = 0;
                number_registrants--;
                emit Refund(recipient, amount);
            }
        }
    }

    function destroy() private {
        if (msg.sender == organizer) {
            selfdestruct(organizer);
	}
    }
	
}
