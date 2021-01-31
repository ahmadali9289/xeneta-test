import axios from "axios";

const API_KEY = process.env.API_KEY || "zSTAhrBZFU19GlvU9DzFUarK0gfW7Tx85rsyaVxV";
const ports_url = "https://685rp9jkj1.execute-api.eu-west-1.amazonaws.com/prod/ports";
const prices_url = "https://685rp9jkj1.execute-api.eu-west-1.amazonaws.com/prod/rates";


export const getPortsListAPI = async () => {
    try {
        const ports = await axios.get(ports_url, {
          headers: {
            "Content-type": "application/json",
            "x-api-key": API_KEY,
          },
        });
        console.log("Ports List : ", ports.data);
        return ports.data;
    } catch (err) {
        console.log(err);
        throw new Error("Could not Fetch Ports. Either there is no data present or the API is down");
    }
};

export const getMarketPriceAPI = async (origin, destination) => {
    try {
        const prices = await axios.get(prices_url, {
            headers: {
              "Content-type": "application/json",
              "x-api-key": API_KEY,
            },
            params: {
              origin: origin,
              destination: destination,
            },
          });
          console.log("Market Price List : ", prices.data);
          if (prices.data[0] && prices.data[0].mean == null) {
              return null
          }
          return prices.data;
    } catch (err) {
        console.log(err);
        throw new Error("Could not Fetch market prices. Either there is no data present or the API is down");
    }
  };