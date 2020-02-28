using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;

public class CustomerController : MonoBehaviour {
	public Transform followSpot;

	public bool atServiceSpot;

	private Transform target;
	private NavMeshAgent navMeshAgent;

	// Start is called before the first frame update
	void Start() {
		navMeshAgent = GetComponent<NavMeshAgent>();
	}

	private void Update() {
		navMeshAgent.SetDestination(target.position);
	}

	public void SetDestination(Transform transform) {
		target = transform;
		//navMeshAgent.SetDestination(target.position);
	}
	public Transform GetDestination() {
		return target;
	}

	public void OnTriggerEnter(Collider other) {
		print(other.tag);

		switch (other.tag) {
			case "ServiceSpot":
				atServiceSpot = true;
				break;
			case "ExitSpot":
				Destroy(gameObject);
				break;
		}
	}
}
