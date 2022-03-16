import React, { useState } from "react";
import { utils } from "ethers";
import { Input } from "antd";
import "./Home.css";
import img1_1 from "../../images/1-1.png";
import img1_2 from "../../images/1-2.png";
import img1_4 from "../../images/1-4.png";
import discord from "../../images/discord-logo.png";
import Video from "../../images/bg1.mp4";

export default function Home({ tx, writeContracts, amountSold }) {
  const [amount, setAmount] = useState("loading...");

  return (
    <>
      <video
        autoPlay
        loop
        muted
        style={{
          position: "fixed",
          width: "100%",
          left: "50%",
          top: "50%",

          transform: "translate(-50%, -50%)",
          zIndex: "-1",
        }}
      >
        <source src={Video} type="video/mp4" />
      </video>
      <div className="container">
        <p className="heading">The IDO will be held on March x, 2022 19:00 UTC to March x, 2022 23:59 UTC.</p>
        <div className="box">
          <div className="total-raised-box">
            <h4>Total BUSD raised</h4>
            <h2>{amountSold ? Number(utils.formatEther(amountSold)).toFixed(2) : "..."}</h2>
          </div>
        </div>
        <div className="total-wallet-box">
          <h4>Presale Open! Contribute $1.00 BUSD to Recieve 1 SPACE</h4>
          <p className="instructions">
            Contribution Amount:{" "}
            <Input
              onChange={e => {
                setAmount(e.target.value);
              }}
            />
          </p>
          <button
            className="btn1"
            onClick={async () => {
              if (amount > 0) {
                const result = tx(
                  writeContracts.BUSD.approve(writeContracts.SpaceIDO.address, utils.parseEther(amount)),
                  update => {
                    console.log("📡 Transaction Update:", update);
                    if (update && (update.status === "confirmed" || update.status === 1)) {
                      console.log(" 🍾 Transaction " + update.hash + " finished!");
                    }
                  },
                );
                console.log("Awaiting wallet confirmation...", result);
                console.log(await result);
              }
            }}
          >
            Approve
          </button>
          &nbsp;
          <button
            className="btn2"
            onClick={async () => {
              const result = tx(writeContracts.SpaceIDO.contribute(utils.parseEther(amount)), update => {
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log("🍾 Transaction " + update.hash + " finished!");
                }
              });
              console.log("Awaiting wallet confirmation...", result);
              console.log(await result);
            }}
          >
            Confirm
          </button>
          &nbsp;
          {/* <button
            className="btn3"
            onClick={async () => {
              const result = tx(writeContracts.SpaceIDO.claim(), update => {
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log("🍾 Transaction " + update.hash + " finished!");
                }
              });
              console.log("Awaiting wallet confirmation...", result);
              console.log(await result);
            }}
          >
            Claim
          </button> */}
        </div>
        <p className="instructions">Please provide your contribution amount, approve your BUSD and then confirm.</p>
      </div>

      <div className="bottomBar a">
        <a href="https://twitter.com/spacemoney9" target="_blank" className="bottomImgs a2" rel="noreferrer">
          <img src={img1_1} alt="" className="bottomImgs2" />
        </a>
        <a href="https://github.com/SpaceMoneydApp/SpaceDao" target="_blank" className="bottomImgs a2" rel="noreferrer">
          <img src={img1_2} alt="" className="bottomImgs2" />
        </a>
        <a href="https://discord.gg/SXZXFtWZFH" target="_blank" className="bottomImgs a2" rel="noreferrer">
          <img src={discord} alt="" className="bottomImgs2" />
        </a>
        <a href="https://t.me/SpaceDaoDapp" target="_blank" className="bottomImgs a" rel="noreferrer">
          <img src={img1_4} alt="" className="bottomImgs2" />
        </a>
      </div>
    </>
  );
}
