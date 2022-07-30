import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import './App.css';

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  font-family: 'Freckle Face', cursive;
  font-size: 20px;
  padding: 15px;
  border-radius: 10px;
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
width: 38%;
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
  const changeScroll = () => {
    
    const scrollValue = document.documentElement.scrollTop;
    if(scrollValue>100){
      setstate(true);
    } else {
      setstate(false);
    }

  }

  window.addEventListener('scroll', changeScroll);

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
    if (newMintAmount > 5) {
      newMintAmount = 5;
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
      <FirstPage>
        <div style={{width: '98%', display: 'flex', flexDirection: 'row-reverse', marginTop: '15px'}}>
          <a href="https://www.google.de/?hl=de">
          <img style={{width: '75px'}} src="/config/images/TW_magix.png"></img>
          </a>
          <a href="https://www.google.de/?hl=de">
          <img style={{width: '75px', marginRight: '5px'}} src="/config/images/OS_magix.png"></img>
          </a>
        </div>
        <div style={{display: 'flex', width: '70%', marginTop: '24px'}}>
          <StyledLogo2 src="/config/images/logo_magix.png"></StyledLogo2>
        </div>
        <MintText>
          <s.TextTitle>
                      A 2,500 collection of Moon Vamps. You’ll need to have $BLOOD in 
                      your wallet to mint. Each Moon Vamp costs 60 $BLOOD to mint. 
                      If you don’t have enough you will be able to 
                      make up the difference with ETH.
          </s.TextTitle>
        </MintText>
        <div>
        {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  SOLD OUT
                </s.TextTitle>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.SpacerXSmall />
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT WALLET
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          fontSize: '24px',
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "MINTING..." : "MINT"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
        </div>
      </FirstPage>
      </Start>
  ); 
}

export const FirstPage = styled.div`
display: flex; 
flex-direction: column; 
justify-self: center; 
align-items: center; 
height: 100vh; 
minWidth: 100%;
background-image: url("/config/images/banner_magix.png");
background-position: 50%; 
background-repeat: no-repeat;
background-size: cover; 
text-align: center; 
box-sizing: border-box;
@media (max-width: 900px) {
  display: flex;
  flex-direction: column;
  justify-self: center;
  align-items: center;
}
`;


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
height: 90vh; 
minWidth: 100%;
background-image: url("/config/images/back.webp");
background-position: 50%; 
background-repeat: no-repeat;
background-size: cover; 
text-align: center; 
box-sizing: border-box;
@media (max-width: 900px) {
  display: flex;
  flex-direction: column;
  justify-self: center;
  align-items: center;
}
`;

export const Slider = styled.div`
display: flex; 
flex-direction: column; 
justify-self: center; 
align-items: center; 
height: 70vh; 
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
@media (min-width: 1850px) {
  height: 55vh;
}
@media (max-width: 1450px) {
  height: 55vh;
}
@media (min-width: 1535px) {
  height: 55vh;
}
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
