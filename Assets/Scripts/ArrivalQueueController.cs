using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ArrivalQueueController : MonoBehaviour {
	public GameObject customerPrefab;
	public Transform customerSpawnPlace;
	public Transform lineupSpot;

	Transform lastPlaceInQueue;

	Queue<GameObject> arrivalQueue = new Queue<GameObject>();
	//public Queue_Utilities queue_Utilities; //=new Queue_Utilities();

	public float arrival_rate = 60; //arrival / min
	//public float arrival_rate = 1f; //arrivals / sec

	private GameController gameController;

	// Start is called before the first frame update
	void Start() {
		//queue_Utilities = GetComponent<Queue_Utilities>();
		// Queue_Utilities.lambda = arrival_rate;
		//StartCoroutine(GenerateArrivals());

		lastPlaceInQueue = lineupSpot;

		gameController = GetComponent<GameController>();
	}

	IEnumerator GenerateArrivals() {
		while (gameController.generatingArrivals == true) {
			float inter_arrival_time_in_seconds = Queue_Utilities.ExpDist(arrival_rate); //this is in min
			//float inter_arrival_time_in_seconds = Queue_Utilities.ObservedDist(); //this is in sec

			inter_arrival_time_in_seconds *= 60;
			//print("inter_arrival_time_in_seconds: " + inter_arrival_time_in_seconds);
			//StartCoroutine(GenerateArrivals());
			yield return new WaitForSeconds(inter_arrival_time_in_seconds);

			GameObject go = Instantiate(customerPrefab, customerSpawnPlace.position, Quaternion.identity);
			go.GetComponent<CustomerController>().SetDestination(lastPlaceInQueue);
			lastPlaceInQueue = go.GetComponent<CustomerController>().followSpot.transform;
			//go.GetComponent<CustomerController>().SetDestination()

			arrivalQueue.Enqueue(go);
			//print("Arrival Queue Length: " + arrivalQueue.Count);
		}
	}

	// Update is called once per frame
	void Update() {
	}

	public void StartArrivals() {
		//Debug.Log("Arrivals started");
		StopCoroutine(GenerateArrivals());
		StartCoroutine(GenerateArrivals());
	}

	public void StopArrivals() {
		//Debug.Log("Arrivals stopped");
		StopCoroutine(GenerateArrivals());
	}

	public int ArrivalQueueCount() {
		return arrivalQueue.Count;
	}

	public GameObject GetFirstCustomer() {
		if (arrivalQueue.Count == 0) {
			return null;
		} else {
			GameObject go = arrivalQueue.Dequeue();
			if (arrivalQueue.Count >= 1) {
				GameObject goFirst = arrivalQueue.Peek();
				goFirst.GetComponent<CustomerController>().SetDestination(lineupSpot);
			}

			return go;
		}
	}
}
