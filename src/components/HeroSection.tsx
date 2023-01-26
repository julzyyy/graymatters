import { InjectedConnector } from "@wagmi/core";
import { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";

import { CHAIN_ID, COLLECTION_SIZE, CONTRACT_ADDRESS, MAX_MINT_AMOUNT } from "../config";
import abi from "../lib/Gobbaghouls.json";
import Header from "./Header";

const contractInfo = {
  addressOrName: CONTRACT_ADDRESS,
  contractInterface: abi,
};

const HeroSection = () => {
  const [buttonText, setButtonText] = useState("Connect Wallet");
  const [error, setError] = useState("");
  const [tx, setTx] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const { data: account } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { activeChain, switchNetworkAsync } = useNetwork();

  const { data: isFree } = useContractRead(contractInfo, "isFree");
  const { data: price } = useContractRead(contractInfo, "price");
  const { data: totalSupply } = useContractRead(contractInfo, "totalSupply");
  const [mintAmount, setMintAmount] = useState(1);

  const { writeAsync: mintNFT } = useContractWrite(contractInfo, "mint", {
    args: [mintAmount],
    overrides: {
      value: Number(price) * Number(mintAmount),
    },
  });

  const switchNetworks = async () => {
    if (account && activeChain?.id != CHAIN_ID && switchNetworkAsync) {
      setButtonText("Switching Network...");
      setButtonDisabled(true);
      await switchNetworkAsync(CHAIN_ID);
      setButtonDisabled(false);
      setButtonText("Mint Your Brain");
    }
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
    if (newMintAmount > MAX_MINT_AMOUNT) {
      newMintAmount = MAX_MINT_AMOUNT;
    }
    setMintAmount(newMintAmount);
  };

  useEffect(() => {
    if (account?.address) {
      setButtonDisabled(false);
      setButtonText("Mint Your Brain");
    } else {
      setButtonDisabled(false);
      setButtonText("Connect Wallet");
    }
    switchNetworks();
  }, [account]);

  useEffect(() => {
    switchNetworks();
  }, [activeChain?.id]);

  const handleButtonClick = async () => {
    if (!account) {
      await connect();
      checkMaxSupply();
      return;
    }

    checkMaxSupply();
    try {
      setButtonDisabled(true);
      setTx("");
      setButtonText("The waiter is grabbing your sdicks...");
      const transaction = await mintNFT();
      const { transactionHash } = await transaction.wait();

      setTx(transactionHash);
      setButtonDisabled(false);
      setButtonText("Mint Your Brain");
    } catch (error: any) {
      setError(error.message);
      setButtonDisabled(true);
      setButtonText("Mint Your Brain");
    }
  };

  const checkMaxSupply = () => {
    if (!totalSupply) {
      return;
    }

    if (parseInt(totalSupply?.toString()) + 1 > COLLECTION_SIZE) {
      setButtonDisabled(true);
      setButtonText("We are out of brains");
      return;
    }
  };
   return (

    <div className="h-screen heroSection bg-bottom bg-cover">

      <Header />




      {/* <img

        src="/images/GG-steep-descent.png"

        alt="steep-descent"

        className="absolute bottom-0 left-0 w-[35%]"

      /> */}

      <div style={{zIndex: -1}} className="bg-black/35 absolute inset-0"></div>




      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-center items-center z-10 relative md:mt-20 px-4">

        <div className="flex-[1.3] flex flex-col md:justify-center items-center mt-10 md:mt-0">

          <img src="/images/GG-logo.png" alt="Gray Matters" className="mt-0 md:-mt-8" />

          <div className="px-12 text-zinc-50">

            <p style={{color: "white"}} className="mb-5 text-center font-bold text-medium">

            Riley experienced a brain aneurysm on Thanksgiving 2022, and has been living without a large piece of his skull for the last two months. Through the help of friends and family, we've created a small NFT collection that will serve as a fundraiser for his 1st and 2nd surgeries.  
            He is currently undergoing surgery to remove the AVM and replace his skull.

            </p>

            <div style={{display:"flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>

            

            <button

              style = {{fontSize:"40px", marginBottom: "0px", marginTop: "25px", backgroundColor: "black"}}

              className="text-2xl border-0 w-[33%] py-3 font-bold bg-zinc-900/60 backdrop-blur-sm disabled:opacity-100"

              onClick={(e) => {

                e.preventDefault();

                decrementMintAmount();

              }}

              disabled={buttonDisabled}

            >

              -

            </button>

            <text

            style = {{

              fontSize:"40px", 

              marginBottom: "0px",

              marginTop: "25px",

              textAlign: "center", 

              color: "#000000", 

              backgroundColor: '#ffffff' 




            }}

            className="text-2xl border-0 w-[34%] py-3 font-bold  disabled:opacity-"

            >

             {mintAmount}

            </text>




            <button

              style = {{fontSize:"40px", marginBottom: "0px", marginTop: "25px", backgroundColor: "black"}}

              className="text-2xl border-0 w-[33%] py-3 font-bold bg-zinc-900/60 backdrop-blur-sm disabled:opacity-75"

              onClick={(e) => {

                e.preventDefault();

                incrementMintAmount();

              }}

              disabled={buttonDisabled}

            >

              +

            </button>

            

            </div>




            <button

              style={{marginTop: "40px", backgroundColor: "black"}}

              className="text-2xl border-0 w-full py-3 font-bold bg-zinc-900/60 backdrop-blur-sm disabled:opacity-75"

              onClick={handleButtonClick}

              disabled={buttonDisabled}

            >

              {buttonText}

            </button>




            {tx && (

              <p className="text-green-500 font-bold text-center mt-3">

                All done, thank you for your generous support{" "}

                <a

                  href={`https://etherscan.io/tx/${tx}`}

                  className="text-green-600"

                  target="_blank"

                  rel="noopener noreferrer"

                >

                  here

                </a>

              </p>

            )}




            {error && (

              <p className="text-red-500 font-bold text-center mt-3">

                Error Occurred.

              </p>

            )}

          </div>

        </div>

      </div>

    </div>

  );

};




export default HeroSection;
