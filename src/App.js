import { useState, useEffect } from "react";
import axios from "axios";
import spinner from "./assets/img/loading.gif";

function App() {
  const [query, setQuery] = useState("تهران");
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState({ name: "", population: "" });
  const [weekDays, setWeekDays] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
  };

  function fillWeekDays(data) {
    /*week days*/
    let uniqueDays = new Set(
      data.list.map((item) => {
        return new Date(item.dt_txt).getDay();
      })
    );
    /* array of week days arrays */
    let arrangedDays = Array.from(uniqueDays).map((day) => {
      return data.list.filter((item) => {
        return new Date(item.dt_txt).getDay() == day;
      });
    });
    setWeekDays(arrangedDays);
  }

  const getWeather = () => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=metric&lang=fa&APPID=${process.env.REACT_APP_SECRET_ID}`
      )
      .then(function (response) {
        if (response.status >= 200 && response.status < 300) {
          fillWeekDays(response.data);
          setCity({
            ...city,
            name: response.data.city.name,
            population: response.data.city.population,
          });
        } else {
          setWeekDays([]);
        }
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setWeekDays([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    getWeather();
  }, [loading]);

  const findPersianDay = (dayNum) => {
    switch (dayNum) {
      case 0:
        return "یکشنبه";
      case 1:
        return "دوشنبه";
      case 2:
        return "سه شنبه";
      case 3:
        return "چهارشنبه";
      case 4:
        return "پنج‌ شنبه";
      case 5:
        return "جمعه";
      case 6:
        return "شنبه";
      default:
        return "";
    }
  };

  const getImage = (icon)=>{
    let newIcon = icon.slice(0, 2) + "d";
    return `http://openweathermap.org/img/wn/${newIcon}@2x.png`;
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  if(loading){
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 loader">
            <p>
              <img src={spinner} />
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="container">
        <div className="row header">
          <div className="col-sm-12 title">
            <h1>آب و هوای شهرها</h1>
          </div>
          <div className="col-sm-12 search">
            <form className="search__form" onSubmit={handleSubmit}>
              <input
                type="text"
                className="search__form-txt"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />
              <input type="submit" value="جستجو" className="search__form-btn" />
            </form>
          </div>
          {city.name !== "" && (
            <div className="col-sm-12 cityInfo">
              <p><span>شهر: </span>
               <span>{city.name}</span>
              </p>
              <p><span>جمعیت: </span>
              <span>{numberWithCommas(city.population)}</span>
              </p>
            </div>
          )}
        </div>

        <div className="row weathers">
          {weekDays.length !== 0 ? (
            weekDays.map((weekDay, index) => {
              return (
                <div className="col-md-4 weather" key={index}>
                  <article className="weather__card">
                    <aside>
                      <h3 className="weather__card-desc">
                        {weekDay[0].weather[0].description}
                      </h3>
                      <img src={getImage(weekDay[0].weather[0].icon)} />
                    </aside>
                    <aside>
                      <h3 className="weather__card-day">
                        {findPersianDay(new Date(weekDay[0].dt_txt).getDay())}
                      </h3>
                      <p className="weather__card-date">
                        {new Intl.DateTimeFormat("fa").format(
                          new Date(weekDay[0].dt_txt)
                        )}
                      </p>
                    </aside>
                    <aside>
                      <p>
                        {weekDay[0].main.temp_min}&deg;C /{" "}
                        {weekDay[0].main.temp_max}&deg;C
                      </p>
                      <p>
                        <span className="weather__card-humidity"> رطوبت: </span>
                        <span>{`%${weekDay[0].main.humidity}`}</span>
                      </p>
                    </aside>
                  </article>
                </div>
              );
            })
          ) : (
            <h3 className="weather__error">
              نتیجه ای یافت نشد. لطفا شهر دیگری وارد کنید.
            </h3>
          )}
        </div>
      </div>
      <footer className="container-fluid footer">
        <div className="row footer__row">
          <div className="col-md-12 footer__col">
            <p>Developer: Aref Movahedzadeh</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default App;
