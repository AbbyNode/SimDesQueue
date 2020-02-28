using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameController : MonoBehaviour {
	public MeshRenderer[] spotRenderers;

	public bool generatingArrivals = false;
	public bool isServicing = false;

	private ArrivalQueueController arrivalQueueController;
	private ServiceController serviceController;

	// Start is called before the first frame update
	void Start() {
		arrivalQueueController = GetComponent<ArrivalQueueController>();
		serviceController = GetComponent<ServiceController>();
	}

	// Update is called once per frame
	void Update() {

	}

	public void ToggleArrivals(bool toggle) {
		generatingArrivals = toggle;

		if (toggle) {
			arrivalQueueController.StartArrivals();
		} else {
			arrivalQueueController.StopArrivals();
		}
	}

	public void ToggleServices(bool toggle) {
		isServicing = toggle;

		if (toggle) {
			serviceController.StartServices();
		} else {
			serviceController.StopServices();
		}
	}

	public void ToggleSpots(bool toggle) {
		foreach (MeshRenderer mesh in spotRenderers) {
			mesh.enabled = toggle;
		}
	}
}
