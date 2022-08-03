import { React, useState } from "react";
import Wheel from "./components/Wheel";
import ItemForm from "./components/Tab/ItemForm/ItemForm";
import Result from "./components/Tab/Result";
import NavigationBar from "./components/NavigationBar";
import { Button, Modal, Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";


function App() {
  const [spinning, setSpinning] = useState(false);

  const [winners, setWinners] = useState([]);

  const [openModal, setOpenModal] = useState(false);


  if (window.localStorage.getItem("duration") === null)
    localStorage.setItem("duration", 10);

  if (window.localStorage.getItem("wheelColor") === null)
    localStorage.setItem("wheelColor", "#d38c12");

  if (window.localStorage.getItem("fontColor") === null)
    localStorage.setItem("fontColor", "#FFFFFF");


  const [wheelColor, setWheelColor] = useState(
    window.localStorage.getItem("wheelColor")
  );

  const [fontColor, setFontColor] = useState(
    window.localStorage.getItem("fontColor")
  );

  const [items, setItems] = useState(() => {
    const value = window.localStorage.getItem("itemsList");
    return value !== null
      ? JSON.parse(value)
      : [
          "Ali",
          "Beatriz",
          "Charles",
          "Diya",
          "Eric",
          "Fatima",
          "Gabriel",
          "Hanna",
        ];
  });





  function changeWheelAndFontColor(color) {
    setWheelColor(color.wheelColor);
    setFontColor(color.fontColor);
  }

  function cancelModal() {
    setOpenModal(false);
  }

  function addData(val) {
    localStorage.setItem("itemsList", JSON.stringify(val));
    setItems(JSON.parse(window.localStorage.getItem("itemsList")));
  }

  // use arrow function so we don't have to .bind(this) in constructor
  function clearListEventHandler() {
    setWinners([]);
  }

  function removeWinnerModal() {
    const winner = winners[winners.length - 1];
    const index = items.indexOf(winner);
    items.splice(index, 1);
    setItems(items);
    setOpenModal(false);
    console.log(`Removed ${winner} from entries.`);
    localStorage.setItem("itemsList", JSON.stringify(items));
  }

  function selectResultEventHandler(data) {
    if (items.length > 0 && spinning !== true) {
      var selectedIndex = data;

      // set this state to disable tab and wheel click when spinning
      setSpinning(true);

      // when spinning disable update player
      document.getElementById("inputTextArea").disabled = true;
      document.getElementById("updateButton").disabled = true;
      document.getElementById("inputSearchBar").disabled = true;
      document.getElementById("shuffleButton").disabled = true;
      document.getElementById("removeButton").disabled = true;
      document.getElementById("clearListButton").disabled = true;

      // after done spinning enable update player
      setTimeout(() => {
        setSpinning(false);
        document.getElementById("inputTextArea").disabled = false;
        document.getElementById("updateButton").disabled = false;
        document.getElementById("inputSearchBar").disabled = false;
        document.getElementById("shuffleButton").disabled = false;
        document.getElementById("removeButton").disabled = false;
        document.getElementById("clearListButton").disabled = false;
      }, window.localStorage.getItem("duration") * 1000);

      setTimeout(() => {
        setWinners(winners.concat(items[selectedIndex]));
      }, window.localStorage.getItem("duration") * 1000);

      setTimeout(() => {
        setOpenModal(true);
      }, window.localStorage.getItem("duration") * 1000);
    }
  }

  let newWinnerIndex = winners.length - 1;

  return (
    <div>
      <NavigationBar onChange={changeWheelAndFontColor} />
      <Modal show={openModal} onHide={cancelModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>We have a winner 🎉</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{winners[newWinnerIndex]}</p>
        </Modal.Body>
        <Modal.Footer>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
          <Button variant="secondary" onClick={cancelModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={removeWinnerModal}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
      <Container fluid>
        <Row>
          <Col className="mt-4" lg="6" md="auto">
            <Wheel
              items={items}
              onChange={selectResultEventHandler}
              spinning={spinning}
              wheelColor={wheelColor}
              fontColor={fontColor}
            />
          </Col>
          <Col lg="3" md="auto">
            <div id="Tabs" className="mt-4">
              <Tabs defaultActiveKey="entries" className="mb-3">
                <Tab eventKey="entries" title="Entries">
                  <ItemForm
                    items={items}
                    winners={winners}
                    onClick={(value) => addData(value)}
                    // pass this key to fix bug when remove winner, textarea won't update
                    // read more: https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html
                    key={items}
                  />
                </Tab>
                <Tab eventKey="results" title="Results">
                  <Result onChange={clearListEventHandler} winners={winners} />
                </Tab>
              </Tabs>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
