//
//  SeatedTableViewController.swift
//  Help's Kitchen
//
//  Created by Stephen Ulmer on 3/31/17.
//  Copyright © 2017 Stephen Ulmer. All rights reserved.
//

import UIKit

class SeatedTableViewController: UIViewController {
    
    var selectedTable: Table?
    
    let statusLabel: UILabel = {
        let sl = UILabel()
        //sl.backgroundColor = CustomColor.Yellow500
        sl.textColor = CustomColor.UCFGold
        sl.translatesAutoresizingMaskIntoConstraints = false
        
        return sl
    }()
    
    let tableCapacityLabel: UILabel = {
        let psl = UILabel()
        //psl.backgroundColor = CustomColor.Yellow500
        psl.textColor = CustomColor.UCFGold
        psl.translatesAutoresizingMaskIntoConstraints = false
        
        return psl
    }()
    
    let reservationNameLabel: UILabel = {
        let rnl = UILabel()
        rnl.textColor = CustomColor.UCFGold
        //rnl.backgroundColor = CustomColor.Yellow500
        rnl.translatesAutoresizingMaskIntoConstraints = false
        
        return rnl
    }()

    let reservationContainer: UIView = {
        let view = UIView()
        view.backgroundColor = CustomColor.Grey800
        view.translatesAutoresizingMaskIntoConstraints = false
        view.layer.cornerRadius = 5
        view.layer.masksToBounds = true
        
        return view
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Back", style: .plain, target: self, action: #selector(handleBack))
        navigationItem.title = selectedTable?.name
        
        view.backgroundColor = CustomColor.Grey850
        
        setLabelValues()
        
        view.addSubview(reservationContainer)
        
        setupInputsContainer()
        
    }
    
    func handleBack() {
        dismiss(animated: true, completion: nil)
    }
    
    func setLabelValues() {
        statusLabel.text = "Table Status:       " + (selectedTable?.status)!
        tableCapacityLabel.text = "Table Size:      " + String(describing: (selectedTable?.capacity)!)
        reservationNameLabel.text = "Reservation Name:      " +  (selectedTable?.reservationName)!
    }
    
    func setupStatusLabel() {
        statusLabel.topAnchor.constraint(equalTo: reservationContainer.topAnchor, constant: 50).isActive = true
        statusLabel.leftAnchor.constraint(equalTo: reservationContainer.leftAnchor, constant: 30).isActive = true
        //statusLabel.widthAnchor.constraint(equalToConstant: 150).isActive = true
        statusLabel.heightAnchor.constraint(equalToConstant: 50).isActive = true
    }
    
    func setupTableCapacityLabel() {
        tableCapacityLabel.topAnchor.constraint(equalTo: statusLabel.bottomAnchor, constant: 50).isActive = true
        tableCapacityLabel.leftAnchor.constraint(equalTo: statusLabel.leftAnchor).isActive = true
        //tableCapacityLabel.widthAnchor.constraint(equalToConstant: 150).isActive = true
        tableCapacityLabel.heightAnchor.constraint(equalToConstant: 50).isActive = true
    }
    
    func setupReservationNameLabel() {
        reservationNameLabel.topAnchor.constraint(equalTo: tableCapacityLabel.bottomAnchor, constant: 50).isActive = true
        reservationNameLabel.leftAnchor.constraint(equalTo: statusLabel.leftAnchor).isActive = true
        //reservationNameLabel.widthAnchor.constraint(equalToConstant: 150).isActive = true
        reservationNameLabel.heightAnchor.constraint(equalToConstant: 50).isActive = true
    }

    func setupInputsContainer() {
        //x, y, width, height
        reservationContainer.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true
        reservationContainer.centerYAnchor.constraint(equalTo: view.centerYAnchor).isActive = true
        reservationContainer.widthAnchor.constraint(equalTo: view.widthAnchor, constant: -70).isActive = true
        reservationContainer.heightAnchor.constraint(equalTo: view.heightAnchor, constant: -100).isActive = true
        
        //shadows
        reservationContainer.layer.masksToBounds = false
        reservationContainer.layer.shadowColor = UIColor.black.cgColor
        reservationContainer.layer.shadowOpacity = 0.5
        reservationContainer.layer.shadowRadius = 10
        reservationContainer.layer.shadowOffset = CGSize.zero
        
        view.addSubview(statusLabel)
        view.addSubview(tableCapacityLabel)
        view.addSubview(reservationNameLabel)
        
        setupStatusLabel()
        setupTableCapacityLabel()
        setupReservationNameLabel()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
}
