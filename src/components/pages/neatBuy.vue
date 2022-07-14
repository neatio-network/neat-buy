<template>
  <div class="main">
        <div class="dashboard1" >
      Binance Smart Chain (BSC) Address
    </div>
    <div class="dashboard2" >
      {{address}}
    </div>
    <div v-if="step == 1">    

      <Access @unlock="unlock"></Access>
    </div>
    <div v-if="step == 2" style="padding-bottom: 90px">

     <div class="box1" >
           <div class="not-connected" v-show="address == ''">
           Please unlock Metamask
           </div>
        <div class="bnblogo" v-show="address != '' && chainID == '0x38'">
        <img
          src="../../assets/bnb.png"
          alt="bnb logo"
          class="bnbimg"
        />
      </div>
         <div class="wallet-address" v-show="address != '' && chainID == '0x38'">
              <span style="color:grey;  font-weight: bold;" > Balance</span> 
               <div class="address-title" v-show="address != '' && chainID == '0x38'">
              <span style="color:white" >{{balance}}</span>  <span style="color:yellow" > BNB</span>  ≈ ${{balance * bnbprice}}
              </div>
               
          </div>

          <div class="wallet-address1" v-show="chainID != '0x38'">
              <span style="color:grey;  font-weight: bold;" > Please switch to Binance Smart Chain (BSC) network by clicking the button "Wrong Network" found on the top right corner.</span> 
   
               
          </div>


      </div>


    
      <div class="box2">
      <div class="info-box">
     
      </div>
                    <div class="neatrate"> 1 NEAT = {{ 0.02 / bnbprice }} BNB</div> 
          <div class="itemNeat">
            <p style="font-size:14px;"></p>
            <input class="inputs"
              v-model="amountToBuy"
              placeholder="Amount To Buy"
            >
          </div>
 
 
        <div class="btn" v-show="address !== ''">
          <button id="gtButton" @click="neatBuy">{{ "Let's Buy" }}</button>
        </div>

        
      </div>
    </div>
  </div>
</template>

<script>
import Access from "./modules/access";
import EyeInput from "./modules/eyeInput";
import neatioapi from "neatioapi";
import axios from "axios";
const Utils = neatioapi.utils;
const Web3 = require('web3');
const web3 = new Web3('https://bsc-dataseed.binance.org/');



export default {
  data() {
    return {
      step: 2,
      balance: "",
      fullbalance:"",
      address: "",
      privateKey: "",
      currentChainId: '',
      chainId: '0x38',
      staking:"",
      rewards:"",
      amount:"",
      limit: "",
      price: "",
      inStake: "",
      circulating: "",
      validators: null,
      aprPercent:"",
      amountToBuy: null,
      amountBNB:"",
      bnbprice:"",
    };
  },
  components: {
    Access,
    EyeInput,
  },

  mounted() {
    this.connectAccount();
    this.initialize();
    this.bnbrate();
  },



  methods: {

    // Metamask initialization
    initialize () {
      ethereum.on("chainChanged", (_chainId) => {        
        this.getGasPrice();
        this.getBalance ()
      });

      ethereum.on("accountsChanged", (_accounts) => {
        this.address = _accounts[0];
        this.getBalance ()
      })
    },


    async connectAccount () {
      try {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        this.address = accounts[0];
        this.getBalance ()
        this.getGasPrice();
      } catch (e) {
        console.log("request accounts error:", e);
      }
    },


    getBalance () {
      ethereum
        .request({
          method: "eth_getBalance",
          params: [this.address]        
        })      
        .then( (result) => {
          this.balance = Utils.toNEAT(result)
        }
        )       
        .catch( (error) => {
            console.log("Error", error)
          }
       )
    },


    getGasPrice() {
      ethereum
        .request({
          method: "eth_gasPrice",
          params: []
        })
        .then((result) => {
            console.log("gasprice", result);
            this.price = Utils.toNEAT(result);
          }
        )
        .catch((error) => {
            console.log('error', error)
          }

        )
    },

   bnbrate() {
    const bnburl = "https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT";
    axios.get(bnburl)
          .then(
            (response) =>
              this.bnbprice = response.data.price,
              console.log(this.bnbprice)
          );

    },


    // BUY
     async neatBuy() {  
    let bnbAmountToSend = this.amountToBuy * (0.02 / this.bnbprice);
    console.log(bnbAmountToSend);
    const amountInBNB = this.bnbAmountToSend;

     const params = [
        {
          from: this.address,
          to: "0xbbe9e63Dcb95105A3Ab5e9094B0C866F0f418987",
          value: web3.utils.toWei('0.025', 'ether'),
          gas: this.limit,
        },
      ];

      ethereum
        .request({
          method: 'eth_sendTransaction',
          params,
        })
        .then((result) => {
          console.log('hash', result);
          this.$alert(result, `You succesfully bought ${this.amountToBuy} NEAT`, {
            confirmButtonText: this.$t("confirm"),
            type: "success",
          });

          setTimeout(() => {
            this.getBalance();
          }, 2000)
        })
        .catch((error) => {
          console.log('tx error', error)
        });
    },
  
       
  },
};
</script>

<style scoped>

button {
	border: none;
   min-width: 40px;
	font-family: Arial, Helvetica, sans-serif;
	text-transform: uppercase;
	cursor: pointer;
	color: #00BFFF;
	box-shadow: inset 0 0 0.1em #00BFFF, 0 0 0.1em #00BFFF;
	border: #00BFFF solid 1px;
	background-color: #24292f;
  border-radius: 4px;
	outline: none;
  margin: 0px 0px 0px 60px;
  }
  
.info {
  display: inline-block;
  margin-left: 10px;
  margin-top: 50px;
}

.address-title {
  margin-bottom:5px;
 
  margin-top:10px;
  width: 420px
}

.wallet-address {
  margin-bottom:5px;
  margin-left: 48px;
  margin-top:10px;
  width: 420px
}
.wallet-address1 {
  margin-bottom:5px;
  margin-left: 48px;
  margin-top:10px;
  width: 540px
}

.inputs {
    background-color: #000;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #a6ff33;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    text-align: center;

}::-webkit-input-placeholder {
  text-align: center;
}

:-moz-placeholder {
  text-align: center;
}

.wallet-balance-available {
  margin-bottom:5px;
}

.balance-details {
  margin-left: 120px;
  margin-top:10px;
}
 .dashboard1{
    font-size:24px;
    font-weight:500;
    color: #00bfFf;
    padding: 60px;  
 }

 .dashboard2{
    font-size:20px;
    font-weight:300;
    color: #fff;
    padding-bottom: 60px;  
 }




 .not-connected {
    font-size:16px;
    font-weight:240;
    color: #00bfFf;
    margin: auto;
    color: #a6ff33;


 }
.neatio {
  display: inline-block;
  font-size: 18px;
  vertical-align: 5px;
}
.item {
  width: 540px;
  display: inline-block;
  vertical-align: top;
  height: 118px;
}
.info-card1 {
  min-width: 146px;
  height: auto;
  border-radius: 4px;
  border-color: #fff;
  border-style: solid;
  border-width: 1px;
  text-align: center;
  display: inline-block;

  margin: 20px 40px 20px 40px;

  justify-content: center;
}
.box1 {
  max-width: 640px;
}

.box2 {
  max-width: 640px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.bnblogo {
  margin-left: 28px;
  margin-top: 10px;
}
.info-box {
    padding-top: 40px;
  text-align: center;
  margin: 0 auto;
}

.card-text {
  background-color: #000;
  padding-top: 10px;
  padding-bottom: 5px;

}
.bnbimg {
  width: 48px;
  height: 48px;
}

.card-number {
  color:#a6ff33;
  margin-top: 10px;
  margin-bottom: 10px;
}


.gt {
  width: 280px;
  height: 44px;
  margin-left: 450px;
  margin-top: 50px;
  color: #000;
}

.button {
  color:#000;
  text-align: center;
   width: 50%;
  margin: 0 auto;

}
.itemNeat {
 width: 50%;
  margin: 0 auto;
  text-align: center;
}
.neatrate {
  text-align: center;
}

.btn {
  display: flex;
}
    #gtButton {
      width: 240px;
      height: 40px;
      color: #000000;
      border: 1px solid #000;
      border-radius: 4px;
      background-color: #00bfff;
      font-size: 16px;
      cursor: pointer;
      margin: 0 auto;
      margin-top: 50px;
    }

    #gtButton:hover {
      background-color: #a6ff33;
    }

</style>

<style>
.el-message-box__message p {
  margin: 0;
  line-height: 24px;
  word-break: break-all;
}
</style>

