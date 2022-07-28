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
  border-radius: 40px;
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
margin-top: 24px;
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
        <div style={{width: '100%', display: 'flex', flexDirection: 'row-reverse'}}>
          <a href="https://www.google.de/?hl=de">
          <img style={{width: '50px', marginRight: '5px', marginTop: '5px'}} src="/config/images/tw.png"></img>
          </a>
          <a href="https://www.google.de/?hl=de">
          <img style={{width: '50px', marginRight: '5px', marginTop: '5px'}} src="/config/images/os.png"></img>
          </a>
        </div>
        <StyledLogo src="/config/images/logo.png"></StyledLogo>
      </FirstPage>


      <SecondPage>
        <HideImage className={state? "left-image-move":"left-image"}>
          <span className="left-image-span">
            <span className="image-span"></span>
            <img className="hero" src="/config/images/hero.webp"></img>
          </span>
        </HideImage>
        <HideImage className={state? "right-image-move":"right-image"}>
          <span className="left-image-span">
            <span className="image-span"></span>
            <img className="hero" src="/config/images/hero-right.webp"></img>
          </span>
        </HideImage>
        <div style={{display: 'flex', width: '50%', marginTop: '100px'}}>
          <StyledLogo2 src="/config/images/logo.png"></StyledLogo2>
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
                  style={{ textAlign: "center", color: "var(--primary-text)" }}
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
                            color: "var(--primary-text)",
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
                        color: "var(--primary-text)",
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
                          color: "var(--primary-text)",
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
      </SecondPage>

      <Slider>
      <div style={{marginTop: 'auto'}}>
      <div class="slider">
            <div class="slide-track">
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
                  <div class="slide">
                  <img src="/config/images/screen.png" height="300" width="300" alt="" />
                  </div>
            </div>
      </div>
      </div>
      </Slider>

      <ThirdPage>
        <div className="container">
            <div className="halfbox">
              <div className="content">
                <div className="imagebox">
                  <img className="logoimage" src="/config/images/logo.png"></img>
                </div>
                <div className="textbox">
                  <s.TextDescription style={{fontSize: '24px', textAlign: 'left'}}>A 2,500 collection of Moon Vamps. You’ll need to have $BLOOD in your wallet to mint.
                  Each Moon Vamp costs 60 $BLOOD to mint. If you don’t have enough you will be able to 
                  make up the difference with ETH.</s.TextDescription>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100%', height: '20%'}}>
                 <StyledButton style={{margin: 'auto', marginLeft: '0px'}}>OPENSEA</StyledButton>
                </div>
              </div>
            </div>
            <div className="halfbox2" style={{width: '50%', height: '100%', display: 'flex', justifyContent: 'center'}}>
                <img src="/config/images/dappr.webp" style={{maxWidth: '100%', width: '70%', height: '80%', margin: 'auto'}}></img>
            </div>
        </div>
      </ThirdPage>


      <footer>
        <div className="test" style={{width: '100%', height: '70px', backgroundColor: 'var(--secondary)'}}>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%'}}>
            <a href="https://www.google.de/?hl=de">
            <img src="/config/images/tw.png" style={{width: '40px', marginTop: '12px', marginRight: '10%'}}></img>
            </a>
            <a href="https://www.google.de/?hl=de">
            <img src="/config/images/os.png" style={{width: '40px', marginTop: '12px', marginLeft: '10%'}}></img>
            </a>
          </div>
        </div>
      </footer>
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
background-image: url("/config/images/isekai.jpg");
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
