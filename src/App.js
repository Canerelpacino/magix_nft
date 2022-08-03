import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import './App.css';
import bg from "./video/bg.mp4"

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  font-family: 'Freckle Face', cursive;
  font-size: 20px;
  padding: 15px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 15px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 200px;
  cursor: pointer;
  box-shadow: 0px 2px 2px 1px #0F0F0F;
  margin-top: '10px';
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--secondary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
margin: auto;
width: 50%;
  @media (max-width: 400px) {
    width: 90%;
    margin-top: 0;
    margin: auto;
  }
`;

export const StyledLogo2 = styled.img`
width: 50%;
margin: auto;
margin-top: 10vh;
  @media (max-width: 600px) {
    width: 100%;
    margin: auto;
    margin-top: 5vh;
  }
`;

export const MintText = styled.div`
width: 70%;
margin-top: 3px;
text-align: center;
  @media (max-width: 600px) {
    width: 350px;
  }
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

export const Start = styled.div`

`;

function App() {
  const [state, setstate] = useState(false);
  setTimeout(function(){
    setstate(true);
},1000);

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState();
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Mint successful`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };
  

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <Start>
         
      <SecondPage>
        <div style={{display: 'flex', width: '50%', margin: 'auto', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        <img src="/config/images/logo_magix.png" style={{width: '100%'}}></img>
        <s.TextTitle style={{fontSize: '30px'}}>Ooops... you have to be on your desktop to mint your Magix!</s.TextTitle>
        </div>
      </SecondPage>
      <div className="desktop">
      <div className="video-wrapper">
        <video autoPlay loop muted>
          <source src={bg} type="video/mp4"></source>
        </video>
        </div>
        <div className={state? "left-image-move":"left-image"}>
          <img src="/config/images/5_copy.png"></img>
        </div>
        <div className={state? "right-image-move":"right-image"}>
          <img src="/config/images/magix_wizard.png"></img>
        </div>

        <div className="socials">
          <img style={{width: '70px', height: '70px'}} src="/config/images/TW_magix.png"></img>
          <img style={{width: '70px', height: '70px'}} src="/config/images/os_magix.png"></img>
        </div>

        <div className="connect">
          <div className="logo-image">
            <img src="/config/images/logo_magix.png" style={{width: '40%'}}></img>
          </div>
        </div>
        <p className="soon">SOOOOONNN...</p>
      </div>
      </Start>
  ); 
}


export const ThirdPage = styled.div`
display: flex; 
flex-direction: column; 
justify-self: center; 
align-items: center; 
height: 100vh; 
minWidth: 100%;
background-image: url("/config/images/back.webp");
background-position: 50%; 
background-repeat: no-repeat;
background-size: cover; 
text-align: center; 
box-sizing: border-box;
@media (max-width: 900px) {
  visibility: hidden;
  clear: both;
  float: left;
  margin: 10px auto 5px 20px;
  width: 28%;
  display: none;
}
@media (min-width: 2000px) {
  visibility: hidden;
  clear: both;
  float: left;
  margin: 10px auto 5px 20px;
  width: 28%;
  display: none;
}
`;

export const SecondPage = styled.div`
display: flex; 
flex-direction: column; 
justify-self: center; 
align-items: center; 
height: 100vh; 
minWidth: 100%;
background-image: linear-gradient(180deg,transparent 60%,#000),linear-gradient(0deg,transparent 50%,#000), url("/config/images/banner_magix.png");
background-position: 50%; 
background-repeat: no-repeat;
background-size: cover; 
text-align: center; 
box-sizing: border-box;
@media (orientation: landscape) {
      visibility: hidden;
      clear: both;
      float: left;
      margin: 10px auto 5px 20px;
      width: 28%;
      display: none;
}
`;

export const Slider = styled.div`
display: flex; 
flex-direction: column; 
justify-self: center; 
align-items: center; 
height: 5vh; 
minWidth: 100%;
background-color: black;
background-position: 50%; 
background-repeat: no-repeat; 
background-size: cover; 
text-align: center; 
box-sizing: border-box;
`;

export const HideImage = styled.div`
@media (max-width: 900px) {
  visibility: hidden;
  clear: both;
  float: left;
  margin: 10px auto 5px 20px;
  width: 28%;
  display: none;
}
`;

export default App;