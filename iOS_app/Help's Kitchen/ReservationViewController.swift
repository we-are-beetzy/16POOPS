//
//  ReservationViewController.swift
//  Help's Kitchen
//
//  Created by Stephen Ulmer on 2/12/17.
//  Copyright © 2017 Stephen Ulmer. All rights reserved.
//

import UIKit
import Firebase

class ReservationViewController: UIViewController {
    
    
    let ref = FIRDatabase.database().reference(fromURL: "https://helps-kitchen.firebaseio.com/")
    
    let dateTimePicker: UIDatePicker = {
        let picker = UIDatePicker()
        picker.translatesAutoresizingMaskIntoConstraints = false
        picker.date = NSDate.init() as Date
        picker.addTarget(self, action: #selector(dateTimeChanged), for: UIControlEvents.valueChanged)
        picker.minuteInterval = 5
        picker.setValue(UIColor(red: 255/255, green: 207/255, blue: 6/255, alpha: 1), forKey: "textColor")
        return picker
    }()
    
    let partySizePicker: UISlider = {
        let psp = UISlider()
        psp.translatesAutoresizingMaskIntoConstraints = false
        psp.minimumValue = 1
        psp.maximumValue = 8
        psp.addTarget(self, action: #selector(partySizeChanged), for: UIControlEvents.valueChanged)
        psp.value = 1
        psp.thumbTintColor = CustomColor.amber500
        psp.minimumTrackTintColor = UIColor(red: 255/255, green: 224/255, blue: 130/255, alpha: 1)
        return psp
    }()
    
    func partySizeChanged() {
        
        let val = Int(partySizePicker.value)
        partySizePicker.value = Float(val)
        partySizeLabel.text = NSString(format: "%2.0f", partySizePicker.value) as String
    }
    
    let partySizeLabel: UILabel = {
        let psl = UILabel()
        psl.translatesAutoresizingMaskIntoConstraints = false
        psl.textColor = UIColor(red: 255/255, green: 207/255, blue: 6/255, alpha: 1)
        psl.text = "1"
        
        return psl
    }()
    
    let submitButton: UIButton = {
        let sb = UIButton()
        sb.translatesAutoresizingMaskIntoConstraints = false
        sb.setTitle("Submit", for: .normal)
        sb.addTarget(self, action: #selector(handleSubmit), for: .touchUpInside)
        sb.backgroundColor = UIColor(red: 255/255, green: 207/255, blue: 6/255, alpha: 1)
        sb.setTitleColor(UIColor.black, for: .normal)
        sb.setTitleColor(UIColor(red: 255/255, green: 207/255, blue: 6/255, alpha: 1), for: .highlighted)
        return sb
    }()
    
    func handleSubmit() {
        
        guard let uid = FIRAuth.auth()?.currentUser?.uid else{
            return
        }
        //TODO add reservation functionality
        ref.child("misc").child("seatingQueue").observeSingleEvent(of: .value, with: {snapshot in
            
            
            
            var currSeatingQueue = snapshot.value as! [String]
            //If
            if currSeatingQueue[0] == "" {
                let tempQueue : NSArray = [uid]
                self.ref.child("misc").child("seatingQueue").setValue(tempQueue)
            } else{
                currSeatingQueue.append(uid)
                self.ref.child("misc").child("seatingQueue").setValue(currSeatingQueue as NSArray)
            }
        })
        
        ref.child("users").child(uid).child("customerHasReservation").setValue(true)
        ref.child("users").child(uid).child("customerHasPaid").setValue(false)
        dismiss(animated: true, completion: nil)
    }
    
    func dateTimeChanged() {
        
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        
        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Logout", style: .plain, target: self, action: #selector(handleLogout))
        
        view.backgroundColor = UIColor.black

        view.addSubview(dateTimePicker)
        view.addSubview(partySizePicker)
        view.addSubview(partySizeLabel)
        view.addSubview(submitButton)
        
        setupDateTimePicker()
        setupPartySizePicker()
        setupPartySizeLabel()
        setupSubmitButton()
        
        // Do any additional setup after loading the view.
    }
    
    func handleLogout() {
        do{
            try FIRAuth.auth()?.signOut()
        }catch let logoutError {
            print(logoutError)
        }
        dismiss(animated: true, completion: nil)
        
    }
    
    
    func setupDateTimePicker() {
        dateTimePicker.topAnchor.constraint(equalTo: view.topAnchor, constant: 50).isActive = true
        dateTimePicker.leftAnchor.constraint(equalTo: view.leftAnchor, constant: 20).isActive = true
        dateTimePicker.rightAnchor.constraint(equalTo: view.rightAnchor, constant: -20).isActive = true
        dateTimePicker.bottomAnchor.constraint(equalTo: dateTimePicker.topAnchor, constant: 100).isActive = true
    }
    
    func setupPartySizePicker() {
        partySizePicker.topAnchor.constraint(equalTo: dateTimePicker.bottomAnchor, constant: 50).isActive = true
        partySizePicker.leftAnchor.constraint(equalTo: view.leftAnchor, constant: 50).isActive = true
        partySizePicker.rightAnchor.constraint(equalTo: view.rightAnchor, constant: -50).isActive = true
        partySizePicker.heightAnchor.constraint(equalToConstant: 20).isActive = true
    }
    
    func setupPartySizeLabel() {
        partySizeLabel.topAnchor.constraint(equalTo: partySizePicker.bottomAnchor, constant: 50).isActive = true
        partySizeLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true
        partySizeLabel.heightAnchor.constraint(equalToConstant: 20).isActive = true
    }
    
    func setupSubmitButton() {
        submitButton.topAnchor.constraint(equalTo: partySizeLabel.bottomAnchor, constant: 50).isActive = true
        submitButton.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive  = true
        submitButton.heightAnchor.constraint(equalToConstant: 50).isActive = true
        submitButton.widthAnchor.constraint(equalToConstant: 150).isActive = true
    }

}
