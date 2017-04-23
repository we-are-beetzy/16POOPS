//
//  WaitingViewController.swift
//  Help's Kitchen
//
//  Created by Stephen Ulmer on 2/13/17.
//  Copyright © 2017 Stephen Ulmer. All rights reserved.
//

import UIKit
import Firebase

class WaitingViewController: UIViewController {
    
    let ref = FIRDatabase.database().reference(fromURL: DataAccess.URL)
    
    let timeLeftLabel: UILabel = {
        let tll = UILabel()
        tll.translatesAutoresizingMaskIntoConstraints = false
        tll.backgroundColor = UIColor.black
        tll.textColor = UIColor.white
        tll.text = "X Minutes Remaining"
    
        return tll
    }()
    
    let tempButton: UIButton = {
        let tb = UIButton()
        tb.translatesAutoresizingMaskIntoConstraints = false
        tb.setTitle("Temp", for: .normal)
        tb.addTarget(self, action: #selector(handleSeated), for: .touchUpInside)
        tb.backgroundColor = UIColor.black
        
        return tb
    }()
    
    func handleSeated() {
        guard let uid = FIRAuth.auth()?.currentUser?.uid else{
            return
        }
        ref.child("users").child(uid).child("customerIsSeated").setValue(true)
        dismiss(animated: true, completion: nil)
    }
    
    func handleCancel(){
        
        guard let uid = FIRAuth.auth()?.currentUser?.uid else{
            return
        }
        //TODO add reservation functionality
        ref.child("users").child(uid).child("customerHasReservation").setValue(false)
        
        dismiss(animated: true, completion: nil)
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor.white
        // Do any additional setup after loading the view.
        
        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Cancel", style: .plain, target: self, action: #selector(handleCancel))
        
        view.addSubview(timeLeftLabel)
        view.addSubview(tempButton)
        
        setupTimeLeftLabel()
        setupTempButton()
    }
    
    func setupTimeLeftLabel() {
        timeLeftLabel.topAnchor.constraint(equalTo: view.topAnchor, constant: 50).isActive = true
        timeLeftLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true
        timeLeftLabel.heightAnchor.constraint(equalToConstant: 50).isActive = true
        timeLeftLabel.widthAnchor.constraint(equalToConstant: 200).isActive = true
    }
    
    func setupTempButton() {
        tempButton.topAnchor.constraint(equalTo: timeLeftLabel.bottomAnchor, constant: 50).isActive = true
        tempButton.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true
        tempButton.heightAnchor.constraint(equalToConstant: 50).isActive = true
        tempButton.widthAnchor.constraint(equalToConstant: 150).isActive = true
    }

}
