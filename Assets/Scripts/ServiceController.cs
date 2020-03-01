using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.AI;

public class ServiceController : MonoBehaviour {
	public float waitForCustomer = .5f; // sec
	public float serviceRate = 0.8f;// rate in mins
	public float minServiceTime = 10f/60f; // Lowest possible service time in mins

	public Text serviceTimeLeft;

	public Transform serviceSpot;
	public Transform exitSpot;

	private GameController gameController;
	private ArrivalQueueController arrivalQueueController;

	// Start is called before the first frame update
	void Start() {
		//queue_Utilities = new Queue_Utilities();
		arrivalQueueController = GetComponent<ArrivalQueueController>();

		gameController = GetComponent<GameController>();
	}

	void Update() {
	}

	public void StartServices() {
		//Debug.Log("Services started");
		StopCoroutine(DoService());
		StartCoroutine(DoService());
	}

	public void StopServices() {
		//Debug.Log("Services stopped");
		StopCoroutine(DoService());
	}

	IEnumerator DoService() {
		while (gameController.isServicing) {
			GameObject go = arrivalQueueController.GetFirstCustomer();
			if (go == null) {
				yield return new WaitForSeconds(waitForCustomer); // wait one frame
			} else {
				CustomerController customerController = go.GetComponent<CustomerController>();

				customerController.SetDestination(serviceSpot);

				// Wait till customer reached service spot
				while (!customerController.atServiceSpot) {
					yield return new WaitForSeconds(waitForCustomer);
				}

				float service_time_in_seconds = Queue_Utilities.ExpDist(serviceRate); //this is in min
				service_time_in_seconds *= 60 * 60 / gameController.timeScale;
				//print("Next service in: " + service_time_in_seconds + " (s)");

				for (int x = (int)service_time_in_seconds; x > 0; x--)
				{
					serviceTimeLeft.text = x.ToString();
					yield return new WaitForSeconds(1);
					
				}

				customerController.SetDestination(exitSpot);
			}
		}
	}
}
