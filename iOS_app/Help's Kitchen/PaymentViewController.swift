//
//  PaymentViewController.swift
//  Help's Kitchen
//
//  Created by Stephen Ulmer on 2/13/17.
//  Copyright © 2017 Stephen Ulmer. All rights reserved.
//

import UIKit
import Firebase

class PaymentViewController: UIViewController {
    
    let ref = FIRDatabase.database().reference(fromURL: "https://helps-kitchen.firebaseio.com/")
    
    let tempButton: UIButton = {
        let tb = UIButton()
        tb.translatesAutoresizingMaskIntoConstraints = false
        tb.setTitle("Temp", for: .normal)
        tb.addTarget(self, action: #selector(handlePay), for: .touchUpInside)
        tb.backgroundColor = UIColor.black
        
        return tb
    }()
    
    func handlePay() {
        guard let uid = FIRAuth.auth()?.currentUser?.uid else{
            return
        }
        
        ref.child("users").child(uid).child("customerIsSeated").setValue(false)
        ref.child("users").child(uid).child("customerHasReservation").setValue(false)
        ref.child("users").child(uid).child("customerHasPaid").setValue(true)
        dismiss(animated: true, completion: nil )
        
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        
        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Cancel", style: .plain, target: self, action: #selector(handleBack))

        // Do any additional setup after loading the view.
        
        view.addSubview(tempButton)
        
        setupTempButton()
    }
    
    func handleBack() {
        
        dismiss(animated: true, completion: nil)
    }
    
    func setupTempButton() {
        tempButton.topAnchor.constraint(equalTo: view.topAnchor, constant: 200).isActive = true
        tempButton.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true
        tempButton.heightAnchor.constraint(equalToConstant: 50).isActive = true
        tempButton.widthAnchor.constraint(equalToConstant: 150).isActive = true
    }


}
