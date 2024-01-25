import react, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Dimensions,
} from "react-native";
import axios from "axios";

export default class MeteorScreen extends Component {
  constructor() {
    super();
    this.state = {
      meteors: {},
    };
  }

  componentDidMount() {
    this.getMeteors();
  }

  getMeteors = () => {
    axios
      .get(
        "https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=aHJTmR3fTE3zAKiO5vBOV4fk8w0SL7gkufrkpRWN"
      )
      .then((dados) => {
        this.setState({
          meteors: dados.data.near_earth_objects,
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  keyExtractor = (item, index) => {
    index.toString();
  };

  renderItem = ({ item }) => {
    let meteor = item;
    let bg_img, speed, size;
    if (meteor.threat_score <= 5) {
      bg_img = require("../assets/meteor_bg1.png");
      speed = require("../assets/meteor_speed1.gif");
      size = 100;
    } else if (meteor.threat_score <= 10) {
      bg_img = require("../assets/meteor_bg2.png");
      speed = require("../assets/meteor_speed2.gif");
      size = 200;
    } else {
      bg_img = require("../assets/meteor_bg3.png");
      speed = require("../assets/meteor_speed3.gif");
      size = 300;
    }
    return (
      <View>
        <ImageBackground style={styles.backgroundImage} source={bg_img}>
          <View style={styles.gifContainer}>
            <Image source={speed} style={{ width: size, height: size }} />
            <View>
              <Text style={styles.cardTitle}>{meteor.name}</Text>
              <Text
                style={[styles.cardText, { marginTop: 20, marginLeft: 50 }]}
              >
                Closest to Earth -
                {item.close_approach_data[0].close_approach_date_full}
              </Text>
              <Text style={[styles.cardText, { marginTop: 5, marginLeft: 50 }]}>
                Minimum Diameter (KM) -
                {item.estimated_diameter.kilometers.estimated_diameter_min}
              </Text>
              <Text style={[styles.cardText, { marginTop: 5, marginLeft: 50 }]}>
                Maximum Diameter (KM) -
                {item.estimated_diameter.kilometers.estimated_diameter_max}
              </Text>
              <Text style={[styles.cardText, { marginTop: 5, marginLeft: 50 }]}>
                Velocity (KM/H) -
                {
                  item.close_approach_data[0].relative_velocity
                    .kilometers_per_hour
                }
              </Text>
              <Text style={[styles.cardText, { marginTop: 5, marginLeft: 50 }]}>
                Missing Earth by (KM) -
                {item.close_approach_data[0].miss_distance.kilometers}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  render() {
    if (Object.keys(this.state.meteors).length === 0) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
          }}
        >
          <Text style={{ fontSize: 50, color: "white" }}>Carregando ...</Text>
        </View>
      );
    } else {
      let meteor_list = Object.keys(this.state.meteors).map((data) => {
        return this.state.meteors[data];
      });
      let meteors = [].concat.apply([], meteor_list);

      meteors.forEach((element) => {
        let diameter =
          (element.estimated_diameter.kilometers.estimated_diameter_min +
            element.estimated_diameter.kilometers.estimated_diameter_max) /
          2;
        let threatScore =
          (diameter / element.close_approach_data[0].miss_distance.kilometers) *
          1000000000;
        element.threat_score = threatScore;
        console.log(threatScore);
      });

      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidArea} />
          <FlatList
            data={meteors}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            horizontal={true}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
  },
  droidArea: {
    manginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  titleContainer: {
    backgroundColor: "transparent",
    flex: 0.15,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 40,
    fontFamily: "fantasy",
    color: "white",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  gifContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  cardTitle: {
    maginTop: 400,
    marginLeft: 50,
    fontSize: 20,
    marginBottom: 10,
    color: "white",
    fontWeight: "bold",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  cardText: {
    color: "white",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

//https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=aHJTmR3fTE3zAKiO5vBOV4fk8w0SL7gkufrkpRWN
