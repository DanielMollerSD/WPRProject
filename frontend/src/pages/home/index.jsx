import "./styles.scss";

function Home() {
  return (
    <>
      <div className="page page-home">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <img
                src="https://img.freepik.com/vrije-photo/een-tevreden-klant-in-een-autoshowroom-die-een-goede-deal-maakt_1303-17385.jpg?semt=ais_hybrid"
                className="card-img-top"
                alt="Card Image"
              ></img>
            </div>
            <div className="col-md-6 d-flex align-items-center">
              <div>
                <h2>"Beste auto huur site van Nederland"</h2>

                <p>
                  Welkom bij Cars And All, uw vertrouwde partner voor het huren
                  van voertuigen! Bij ons kunt u terecht voor een breed scala
                  aan voertuigen, van auto's tot campers en caravans, allemaal
                  zorgvuldig geselecteerd om aan uw behoeften te voldoen.
                </p>
                <p>
                  Bij Cars And All streven we ernaar om niet alleen uw
                  verwachtingen te vervullen, maar ze te overtreffen. We staan
                  voor kwaliteit, betrouwbaarheid, en service die u kunt
                  vertrouwen!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
