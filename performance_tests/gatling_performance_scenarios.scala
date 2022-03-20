package dp2

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class gatling_script extends Simulation {

	val httpProtocol = http
		.baseUrl("http://127.0.0.1:8080/")

	val headers_0 = Map(
		"Content-Type" -> "application/json")

	object RegisterManager {
		val registerManager = exec(http("RegisterManager")
			.post("v0/actors/")
			.headers(headers_0)
  			.body(StringBody("""{
				"name": "Raúl",
				"surname": "garcia",
				"email": "raulManager@gmail.com",
				"password": "12345",
				"role": "MANAGER"
				}"""))
		).pause(3)
	}

	object LoginManager {
		val loginManager = exec(http("LoginManager")
			.get("v1/login/")
  			.queryParam("email", "raulManager@gmail.com")
			.queryParam("password", "12345")
			.headers(headers_0)
		).pause(3)
	}

	object CreateTrip {
		val createTrip = exec(http("CreateTrip")
			.post("v0/trips/")
			.headers(headers_0)
  			.body(StringBody("""{
				"title": "Multiaventura en Granada",
				"description": "Tremenda multiaventura súper disfrutable.",
				"requirements": ["Ser mayor de edad", "Medir más de 1,70"],
				"dateStart": "2022-03-28T21:59:33.923Z",
				"dateEnd": "2022-04-04T21:59:33.923Z",
				"manager": "621d26b90ba6a368db153d3f",
				"stages": [
					{
						"title":"Snowboard en Sierra Nevada",
						"description":"Disfruta de un día de nieve",
						"price":20.0
					},
					{
						"title": "Descenso por el río",
						"description": "Descenso súper divertido.",
						"price": 15
					}
					]
				}"""))
			).pause(3)
	}

	object RegisterExplorer {
		val registerExplorer = exec(http("RegisterExplorer")
			.post("v0/actors/")
			.headers(headers_0)
  			.body(StringBody("""{
				"_id": "621d26b90ba6a368db153d3d",
				"name": "Paco",
				"surname": "Gerte",
				"email": "pacoExplorer@gmail.com",
				"password": "12345",
				"role": "EXPLORER"
				}"""))
		).pause(3)
	}

	object LoginExplorer {
		val loginExplorer = exec(http("LoginExplorer")
			.get("v1/login/")
  			.queryParam("email", "pacoExplorer@gmail.com")
			.queryParam("password", "12345")
			.headers(headers_0)
		).pause(3)
	}

	object CreateApplication {
		val createApplication = exec(http("CreateApplication")
			.post("v0/trips/")
			.headers(headers_0)
  			.body(StringBody("""{
				"explorer": "621d26b90ba6a368db153d3d",
				"trip": "621d4e6350f1264bc7f827da"
			}"""))
			).pause(3)
	}

	val scn1 = scenario("Manager creates trip").exec(
		RegisterManager.registerManager,
		LoginManager.loginManager,
		CreateTrip.createTrip
	)

	val scn2 = scenario("Explorer creates application").exec(
		RegisterExplorer.registerExplorer,
		LoginExplorer.loginExplorer,
		CreateApplication.createApplication,
	)

	// Pruebas mínimo número de usuarios concurrentes no soportados
	// setUp(scn1.inject(rampUsers(42500) during (100 seconds)),
	// 	scn2.inject(rampUsers(42500) during (100 seconds))
	// 	).protocols(httpProtocol)

	// Pruebas máximo número de usuarios soportados teniendo un rendimiento correcto
	setUp(scn1.inject(rampUsers(5250) during (100 seconds)),
			scn2.inject(rampUsers(5250) during (100 seconds))
			).protocols(httpProtocol)
			.assertions(
				 global.responseTime.max.lt(6000),
				 global.responseTime.mean.lt(1500),
		)
}