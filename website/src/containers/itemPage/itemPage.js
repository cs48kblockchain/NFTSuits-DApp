import React from "react";
import {
  makeStyles,
  Button,
  Grid,
  Container,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableContainer,
  TableHead,
  TableBody,
  Typography,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import PanToolSharpIcon from "@material-ui/icons/PanToolSharp";
import LocalOfferSharpIcon from "@material-ui/icons/LocalOfferSharp";
import StarsIcon from "@material-ui/icons/Stars";
import DnsIcon from "@material-ui/icons/Dns";
import ItemButtonGroup from "../../components/itemButtonGroup/itemButtonGroup";
import NftContract from "../../abis/nft.json";

import addresses from "../../constants/contracts";
import { useRecoilCallback } from "recoil";
import {
  allItems,
  itemData,
  myAddress,
  transactionData,
} from "../../recoils/atoms";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

{
  /* <div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  Hello world
</div>; */
}
const MarketCardData = {
  name: "Kol",
  rarity: "Legendary",
  owner: "Cavit",
  imgUrl: "https://sc04.alicdn.com/kf/Uf4c62ba9db5c4371a07c52c140f7054cG.jpg",
  price: "10",
  auctionPrice: "12",
};
const isThirdPerson = true;

const ItemPage = (props) => {
  //const [data, setData] = useRecoilState(allItems);

  const [data, setData] = useRecoilState(itemData);
  const [address, setAddress] = useRecoilState(myAddress);
  const [transactions, setTransactions] = useRecoilState(transactionData);
  const [id, setId] = React.useState(props.match.params.id);

  React.useEffect(async () => {
    let myAddress = await window.ethereum.selectedAddress;
    setAddress(myAddress);

    var nft_contract_interface = new window.web3.eth.Contract(
      NftContract.abi,
      addresses.NFT_CONTRACTS_ADDRESS
    );

    nft_contract_interface.methods
      .tokenByIndex(id)
      .call()
      .then((currentTokenId) => {
        return nft_contract_interface.methods
          .nfts(currentTokenId - 1)
          .call()
          .then((currentNftData) => {
            nft_contract_interface.methods
              .ownerOf(currentTokenId)
              .call()
              .then((owner) => {
                // console.log("currentTokenId", currentTokenId);
                // console.log("owner", owner);
                setData({ ...currentNftData, owner: owner });
              })
              .catch((error) => {
                console.log(error);
              });
          });
      });

    nft_contract_interface
      .getPastEvents("nftTransaction", {
        filter: { id: parseInt(id) + 1 },
        fromBlock: 0,
        toBlock: "latest",
      })
      .then((events) => {
        console.log("events.console.log", events);
        setTransactions(events);
      });

    // var event = nft_contract_interface.events.nftTransaction(
    //   (error, result) => {
    //     if (!error) console.log("result", result);
    //   }
    // );
  }, [window.web3.eth]);

  if (!data || data.owner == undefined || transactions == undefined) {
    return <div>loading</div>;
  }

  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="flex-start"
    >
      <Grid item xs={4}>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          style={{ height: "90vh" }}
        >
          {/* <Paper variant="outlined"> */}
          <div
          // style={{
          //   backgroundColor: "#006666",
          // }}
          >
            <img style={{ width: 300 }} src={data.cid} />
          </div>
          {/* </Paper> */}
        </Grid>
      </Grid>
      <Grid item xs={8}>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
          style={{ height: "90vh" }}
        >
          <Grid container style={{ marginTop: 40 }}>
            <Grid item xs={12}>
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="flex-start"
              >
                {/* <Paper variant="outlined"> */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginLeft: 20,
                  }}
                >
                  <div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <Typography variant="h2" display="block" gutterbottom>
                        Name: {data.name}
                      </Typography>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: 20,
                      }}
                    >
                      <StarsIcon
                        style={{
                          verticalAlign: "middle",
                          marginTop: 5,
                          marginRight: 5,
                          fontSize: 20,
                        }}
                      />
                      <Typography
                        variant="overline"
                        display="block"
                        gutterbottom
                      >
                        Rarity: {data.rarity}
                      </Typography>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: 10,
                      }}
                    >
                      <AccountCircleIcon
                        style={{
                          verticalAlign: "middle",
                          marginTop: 2,
                          marginRight: 5,
                          fontSize: 20,
                        }}
                      />
                      <Typography variant="body1" display="block" gutterbottom>
                        Owner:{" "}
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            window.location = "/profile/" + data.owner;
                          }}
                        >
                          {data.owner.slice(0, 6) +
                            "..." +
                            data.owner.slice(
                              data.owner.length - 4,
                              data.owner.length
                            )}
                        </Button>
                      </Typography>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginBottom: 10,
                      }}
                    >
                      <LocalOfferSharpIcon
                        style={{
                          verticalAlign: "middle",
                          marginTop: 3,
                          marginRight: 5,
                          fontSize: 20,
                        }}
                      />
                      <Typography variant="body1" display="block" gutterbottom>
                        Price: {data.isOnSale ? "Ξ " + data.sellPrice : "-"}
                      </Typography>
                    </div>
                    <div>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <PanToolSharpIcon
                          style={{
                            verticalAlign: "middle",
                            marginRight: 5,
                            marginTop: 2,
                            fontSize: 20,
                          }}
                        />
                        <Typography
                          variant="body1"
                          display="block"
                          gutterbottom
                        >
                          Highest Bid:{" "}
                          {data.isBiddable ? "Ξ " + data.maxBid : "-"}
                        </Typography>
                      </div>
                      {!isThirdPerson && <Button>isThirdPerson=false</Button>}
                    </div>
                  </div>
                  <div style={{ marginRight: 140, marginTop: 30 }}>
                    <ItemButtonGroup />
                  </div>
                </div>
                {/* </Paper> */}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="flex-start"
              >
                {/* <Paper variant="outlined"> */}
                <TableContainer
                  component={Paper}
                  style={{ marginTop: 50, width: "60vw", height: "40vh" }}
                >
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Type</TableCell>
                        <TableCell align="center">From</TableCell>
                        <TableCell align="center">To</TableCell>
                        <TableCell align="center">Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions.map((transaction, index) => {
                        return (
                          <TableRow
                            key={index}
                            style={{
                              backgroundColor:
                                transaction.returnValues.transactionType ===
                                "claimed"
                                  ? "#ff00ff"
                                  : "#ffff00",
                            }}
                          >
                            <TableCell align="center">
                              {transaction.returnValues.transactionType}
                            </TableCell>

                            <TableCell align="center">
                              {transaction.returnValues.fromAddress ==
                              "0x0000000000000000000000000000000000000000" ? (
                                "0x0"
                              ) : (
                                <Button
                                  size="small"
                                  color="primary"
                                  onClick={() => {
                                    window.location = "/profile/" + data.owner;
                                  }}
                                >
                                  {transaction.returnValues.fromAddress.slice(
                                    0,
                                    6
                                  ) +
                                    "..." +
                                    transaction.returnValues.fromAddress.slice(
                                      transaction.returnValues.fromAddress
                                        .length - 4,
                                      transaction.returnValues.fromAddress
                                        .length
                                    )}
                                </Button>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                size="small"
                                color="primary"
                                onClick={() => {
                                  window.location = "/profile/" + data.owner;
                                }}
                              >
                                {transaction.returnValues.toAddress.slice(
                                  0,
                                  6
                                ) +
                                  "..." +
                                  transaction.returnValues.toAddress.slice(
                                    transaction.returnValues.toAddress.length -
                                      4,
                                    transaction.returnValues.toAddress.length
                                  )}
                              </Button>
                            </TableCell>
                            <TableCell align="center">
                              {transaction.returnValues.value == 0
                                ? " - "
                                : "Ξ " + transaction.returnValues.value}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* </Paper> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ItemPage;
