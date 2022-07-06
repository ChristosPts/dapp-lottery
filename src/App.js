import web3 from './web3';
import './App.css';
import { useState, useEffect ,Component} from 'react'
import lotteryContract from './lotteryContract';
import laptop from './laptop.png';
import car from './car.png';
import phone from './phone.png';
 
function App () {
  const [ownerAdd,getOwnerAdd]=useState("");
  const [account,setAccount]=useState("");
  const [balance,getTheBalance] = useState("");
  const [carMsg, setcarMsg] = useState("");
  const [phoneMsg, setphoneMsg] = useState("");
  const [PCMsg, setPCMsg] = useState("");
  const [Errmsg,setErrmsg] = useState(false);
  const [successMessage, setsuccessMessage] = useState("");
  const [newOwner, setnewOwner] = useState('');
  const [numCarBids,SnumCarBids] = useState('')
  const [numPhoneBids,SnumPhoneBids] = useState('')
  const [numPCBids,SnumPCBids] = useState('')
  const [show, setShow] = useState(false)
  
  //έλεγχος καθε 5 sec αν αυξηθήκαν τα ether για ανανέωση αριθμού + ανανέωση αριθμού bids   
   useEffect(()=>{ 
      if (lotteryContract) getAllBalance()
      if (lotteryContract) getOwner()
      if (lotteryContract) getPCBidnums()
      if (lotteryContract) getCarBidnums()
      if (lotteryContract) getPhoneBidnums()
          const timer = setInterval(() => {getTheBalance(oldCount => oldCount + 1)}, 5000);
          return () => { clearInterval(timer); };
    },[lotteryContract,balance,ownerAdd,numCarBids,numPhoneBids,numPCBids ])

  // έλεγχος καθε 5 sec αν άλλαξε πορτοφόλι για ανανέωση πορτοφολιού 
  useEffect(()=>{ 
      if (lotteryContract) connectWallet()
          const timer2 = setInterval(() => {setAccount(oldAcc => oldAcc+1)}, 5000);
          return () => { clearInterval(timer2); };
  },[lotteryContract,account])

  //λήψη υπολοίπου ether
  const getAllBalance =  async() =>{
    const balan = await lotteryContract.methods.getBalance().call();
    getTheBalance(web3.utils.fromWei( balan, 'ether'))
  }
  //λήψη υπολοίπου του ιδιοκτ΄ητη
  const getOwner =  async() =>{
    const manager = await lotteryContract.methods.beneficiary().call();
    getOwnerAdd(manager)
  }
 
  //Ενωση πορτοφολιού 
  const connectWallet = async()=> {
    if(typeof window !== "undeined" && typeof window.ethereum !== "undeined") {
      try{
          const accounts = await window.ethereum.request({method:"eth_requestAccounts" });  
          setAccount(accounts[0]);
       }catch(err){  }
    }else  {
      console.log("Please install metamask");
    }
  }
   

//κάλεσμα συναρτήσεων για bid---------------------------------------
  const CarBid = async event => {
  event.preventDefault();
   try{ 
      const address = await web3.eth.getAccounts();
      await lotteryContract.methods.bidCar().send({
        from: address[0],
        value: '10000000000000000',
        gasLimit: '300000'});
        setsuccessMessage('You have successfully bid for the Car!')
    }catch(err){setErrmsg('Error! Car bid unsuccessful.')}
  }


  const PhoneBid = async event => {
    event.preventDefault();
    try{
      const address = await web3.eth.getAccounts();
      await lotteryContract.methods.bidPhone().send({
        from: address[0],
        value: '10000000000000000',
        gasLimit: '300000' });
        setsuccessMessage('You have successfully bid for the Phone!')
    }catch(err){setErrmsg('Error! Phone bid unsuccessful.')}
  }

  const LaptopBid = async event => {
    event.preventDefault();
    try{
      const address = await web3.eth.getAccounts();
      await lotteryContract.methods.bidcomputer().send({
        from: address[0],
        value: '10000000000000000',
        gasLimit: '300000'});
        setsuccessMessage('You have successfully bid for the Laptop!')
    }catch(err){setErrmsg('Error! Laptop bid unsuccessful.')}
  }
//-----------------------------------------------------------------
const DeclareCarWinner = async () =>{
  try{
    const address = await web3.eth.getAccounts();
        await lotteryContract.methods.revealCarWinners().send({
        from:  address[0], gasLimit: '300000' });
        setcarMsg(`The Car winner is: ${address}`)
      }catch(err){setErrmsg('Error!')}
      
}
 const DeclarePhoneWinner = async ()  =>{ 
    try{
     const address = await web3.eth.getAccounts();
      await lotteryContract.methods.revealPhoneWinner().send({
        from:  address[0],gasLimit: '300000' });
        setphoneMsg(`The Phone winner is: ${address}`)
      }catch(err){setErrmsg('Error!')}
}

 const DeclareLaptopWinner = async ()  =>{ 
  try{ 
    const address = await web3.eth.getAccounts();
    await lotteryContract.methods.revealPCWinner().send({
      from:  address[0],gasLimit: '300000' });
      setPCMsg(`The Laptop winner is: ${address}`)
    }catch(err){setErrmsg('Error!')}
}

  //Ανάληψη χρημάτων
  const ethWithdraw = async event => {
    try{
    event.preventDefault();
    const address = await web3.eth.getAccounts();
    await lotteryContract.methods.withdraw().send({
      from: address[0],
      gasLimit: '300000'
      
    });setsuccessMessage('Withdraw Successfull!')
  }catch(err){setErrmsg('Error! Withdraw failed.')}
  }

  //μεταβίβαση συμβολαίου
  const updateOwner = async event =>{
    setnewOwner(event.target.value)
  }
  const TransferContract = async event =>{
   try{ event.preventDefault();
      const address = await web3.eth.getAccounts();
       await lotteryContract.methods.transfer(newOwner).send({
        from: address[0],
        gasLimit: '300000'
      }); setsuccessMessage('Transfer Successfull!')
    }catch(err){setErrmsg('Error! Transfer failed.')}
  }

   //καταστροφή συμβολαίου
  const DestroyContract = async event =>{
    event.preventDefault();
    const address = await web3.eth.getAccounts();
       await lotteryContract.methods.destroy().send({
        from: address[0],
        gasLimit: '300000' });
  } 
//παρουσίαση αριθμού bids
  const getCarBidnums =  async() =>{
    const bids = await lotteryContract.methods.getCarBids().call();
    SnumCarBids(bids)
  }
  const getPhoneBidnums =  async() =>{
    const bids = await lotteryContract.methods.getPhoneBids().call();
    SnumPhoneBids(bids)
  }
  const getPCBidnums =  async() =>{
    const bids = await lotteryContract.methods.getPCBids().call();
    SnumPCBids(bids)
  }
 
return (
   <div className='container'> 
      <div className='title'>
          <div> <h2> Lottery ... try your luck! </h2> </div>
        <hr/> 
      </div>   
  
        <div className="main"> Owned by: {ownerAdd}
          <div > Overal ether ammount in contract: {balance} </div>
          <div>  Connected Account: {account}   </div> 
        </div>
         
        <div className="sidebar">  <div className="center">
          <div> <button onClick={ethWithdraw} className='ownerBttn' >Withdraw</button> </div >
            <div> <input onChange = {updateOwner} className="input" type = "text" placeholder = "Enter new address..."/> <div></div>
            <button onClick ={TransferContract} className='ownerBttn' >Transfer</button>
            </div>

          <div> <button onClick = {DestroyContract} className='Destroy'>Destroy</button>
          <p>WARNING! This button destroys the functionality of the contract</p> </div>
        </div></div>
        
        <div className='content1'><hr/>
         <p style={{fontSize: "Large",fontWeight: "bold"}}><span>Bids for Car  ...  </span> {show?<span>{numCarBids} bids</span>:null} </p>
          
          <div><img src={car} alt="Missing Image"/> </div>
          <div className="Bclass"> <button onClick= { CarBid } className = "bidButtons">Bid </button>   </div>
        </div>

       <div className="content2"><hr/>
       <p style={{fontSize: "Large",fontWeight: "bold"}}><span>Bids for Phone  ...  </span> {show?<span>{numPhoneBids} bids</span>:null}</p>
         
          <div> <img src={phone} alt="Missing Image"/> </div>
          <div className="Bclass"><button onClick= {PhoneBid} className = "bidButtons">Bid </button></div>
        </div>

        <div className="content3"><hr/>
        <p style={{fontSize: "Large",fontWeight: "bold"}}><span >Bid for Laptop ... </span> {show?<span>{numPCBids} bids</span>:null}</p>
          
          <div> <img src={laptop} alt="Missing Image"/> </div>
          <div className="Bclass"> <button onClick={LaptopBid} className = "bidButtons">Bid</button></div>
        </div>
         
        <div className="content4">
          <div className="left">
          <div ><button onClick = {function(){DeclareCarWinner();DeclarePhoneWinner();DeclareLaptopWinner() }}
          className ='winnerBttn' >Declare Winner</button> <br></br>{carMsg}<br></br> {phoneMsg}<br></br> {PCMsg} </div> </div>
        </div>
        
        <div className="content5">  <div className="right">
          <div> <button  className='userBttn' >Am i Winner</button></div>
          <button onClick = {()=>setShow(!show)} className='userBttn' >Reveal</button>  
          </div> 
        </div>

        <div className="content6">  <div className='successMessage'>{successMessage} </div> <hr></hr> <div className='errors'>{Errmsg }</div> </div>  
      </div>
    );

}
export default App;
