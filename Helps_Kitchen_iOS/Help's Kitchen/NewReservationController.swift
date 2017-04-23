//
//  NewReservationController.swift
//  Help's Kitchen
//
//  Created by Stephen Ulmer on 3/6/17.
//  Copyright © 2017 Stephen Ulmer. All rights reserved.
//

import UIKit
import Firebase

class NewReservationController: UIViewController, UIPickerViewDelegate, UIPickerViewDataSource, UITextFieldDelegate {
    
    let ref = FIRDatabase.database().reference(fromURL: DataAccess.URL)
    
    var partySizeArray: [Int] {
        get{
            return [1,2,3,4,5,6,7,8]
        }
    }
    
    var pickedPartySize: Int? = 1
    
    let dateTimePicker: UIDatePicker = {
        let picker = UIDatePicker()
        picker.translatesAutoresizingMaskIntoConstraints = false
        picker.date = NSDate.init() as Date
        picker.addTarget(self, action: #selector(dateTimeChanged), for: UIControlEvents.valueChanged)
        picker.minuteInterval = 5
        picker.setValue(CustomColor.UCFGold, forKey: "textColor")
        return picker
    }()
    
    let partySizePicker: UIPickerView = {
        let psp = UIPickerView()
        psp.translatesAutoresizingMaskIntoConstraints = false
        psp.setValue(CustomColor.UCFGold, forKey: "textColor")
        psp.tintColor = CustomColor.UCFGold
        
        return psp
    }()
    
    let nameTextField: UITextField = {
        let tf = UITextField()
        tf.placeholder = "Enter Name"
        tf.textColor = CustomColor.UCFGold
        tf.translatesAutoresizingMaskIntoConstraints = false
        tf.backgroundColor = CustomColor.Grey825
        tf.layer.cornerRadius = 15
        tf.layer.sublayerTransform = CATransform3DMakeTranslation(5, 0, 0)
        tf.returnKeyType = UIReturnKeyType.done
        
        //tf.layer.borderWidth = 10
        //tf.layer.borderColor = CustomColor.Grey850.cgColor
        
        tf.attributedPlaceholder = NSAttributedString(string: "Enter Name",
                                                              attributes: [NSForegroundColorAttributeName: CustomColor.UCFGoldTrans75])
        return tf
    }()
    
    let partySizeLabel: UILabel = {
        let psl = UILabel()
        psl.translatesAutoresizingMaskIntoConstraints = false
        psl.textColor = CustomColor.UCFGold
        psl.text = "Select Party Size"
        return psl
    }()
    
    let errorLabel: UILabel = {
        let el = UILabel()
        el.textColor = UIColor.red
        el.translatesAutoresizingMaskIntoConstraints = false
        
        return el
    }()
    
    let nameContainerView: UIView = {
        let view = UIView()
        view.backgroundColor = CustomColor.UCFGold
        view.translatesAutoresizingMaskIntoConstraints = false
        view.layer.cornerRadius = 5
        view.layer.masksToBounds = true
        return view
    }()
    
    let inputsContainerView: UIView = {
        let view = UIView()
        view.backgroundColor = CustomColor.Grey800
        view.translatesAutoresizingMaskIntoConstraints = false
        view.layer.cornerRadius = 5
        view.layer.masksToBounds = true
        
        return view
    }()
    
    func dateTimeChanged() {
        print(dateTimePicker.date)
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Cancel", style: .plain, target: self, action: #selector(handleCancel))
        
        navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Create", style: .plain, target: self, action: #selector(handleCreate))
        
        navigationItem.title = "Reservation"
        
        view.backgroundColor = CustomColor.Grey850
        
        
        view.addSubview(inputsContainerView)
        
        
        setupInputsContainer()
        
        self.nameTextField.delegate = self
    }
    
    func handleCancel() {
        dismiss(animated: true, completion: nil)
    }
    
    func toMilliseconds(str: String) -> String{
        var temp = str
        
        temp = temp.replacingOccurrences(of: ".", with: "")
        temp = temp.substring(to: temp.index(temp.startIndex, offsetBy: 12))
        
        return temp
    }
    
    func handleCreate() {
        
        var currentReservations: [String]?
    
        ref.child("ReservationQueue").observeSingleEvent(of: .value, with: {snapshot in
            
            var nameIsNotTaken = true
            
            currentReservations = snapshot.value as? [String]
            
            for res in currentReservations! {
                print(res.lowercased())
                print((self.nameTextField.text?.lowercased())!)
                
                if res.lowercased() == (self.nameTextField.text?.lowercased())! {
                    self.nameTextField.shake()
                    self.errorLabel.text = "Reservation name taken."
                    self.errorLabel.shake()
                    nameIsNotTaken = false
                }
            }
            
            if nameIsNotTaken {
            
                if currentReservations?[0] == "" {
                currentReservations?[0] = self.nameTextField.text!
                } else {
                currentReservations?.append(self.nameTextField.text!)
                }
            
                self.ref.child("ReservationQueue").setValue(currentReservations)
                
                let dateTime = self.dateTimePicker.date.description
                
                let partySize = self.pickedPartySize!
                
                var resKey = String(NSDate.init().timeIntervalSince1970)
                
                resKey = self.toMilliseconds(str: resKey)
                
                self.ref.child("Reservations").child(resKey).updateChildValues(["dateTime": dateTime, "partySize": partySize, "name":self.nameTextField.text!],withCompletionBlock: {(err, ref) in
                    
                    if err != nil {
                        print(err!)
                        return
                    }
                    
                    print("Saved user successfully")
                })
                
                self.dismiss(animated: true, completion: nil)
            }
        })
    }
    
    func setupDateTimePicker() {
        dateTimePicker.topAnchor.constraint(equalTo: partySizeLabel.bottomAnchor, constant: 25).isActive = true
        dateTimePicker.leftAnchor.constraint(equalTo: inputsContainerView.leftAnchor, constant: 20).isActive = true
        dateTimePicker.rightAnchor.constraint(equalTo: inputsContainerView.rightAnchor, constant: -20).isActive = true
        dateTimePicker.bottomAnchor.constraint(equalTo: dateTimePicker.topAnchor, constant: 100).isActive = true
    }
    
    func setupPartySizePicker() {
        partySizePicker.delegate = self
        partySizePicker.dataSource = self
        partySizePicker.reloadAllComponents()
        
        partySizePicker.topAnchor.constraint(equalTo: nameTextField.bottomAnchor, constant: 20).isActive = true
        partySizePicker.leftAnchor.constraint(equalTo: partySizeLabel.leftAnchor, constant: 125).isActive = true
        partySizePicker.widthAnchor.constraint(equalToConstant: 100).isActive = true
        partySizePicker.heightAnchor.constraint(equalToConstant: 75).isActive = true
        
        
    }
    
    func setupPartySizeLabel() {
        partySizeLabel.topAnchor.constraint(equalTo: nameTextField.bottomAnchor, constant: 20).isActive = true
        partySizeLabel.leftAnchor.constraint(equalTo: inputsContainerView.leftAnchor, constant: 50).isActive = true
        //partySizeLabel.widthAnchor.constraint(equalToConstant: 100).isActive = true
        partySizeLabel.heightAnchor.constraint(equalToConstant: 75).isActive = true
    }
    
    func setupNameTextField(){
        nameTextField.topAnchor.constraint(equalTo: inputsContainerView.topAnchor, constant: 50).isActive = true
        nameTextField.leftAnchor.constraint(equalTo: inputsContainerView.leftAnchor, constant: 50).isActive = true
        nameTextField.widthAnchor.constraint(equalToConstant: 200).isActive = true
        nameTextField.heightAnchor.constraint(equalToConstant: 50).isActive = true
    }
    
    func setupErrorLabel(){
        errorLabel.topAnchor.constraint(equalTo: nameTextField.bottomAnchor, constant: 10).isActive = true
        errorLabel.centerXAnchor.constraint(equalTo: inputsContainerView.centerXAnchor, constant: 10).isActive = true
        //errorLabel.widthAnchor.constraint(equalToConstant: 150).isActive = true
        errorLabel.heightAnchor.constraint(equalToConstant: 50).isActive = true
    }

    func setupNameContainerView() {
        //x, y, width, height
        nameContainerView.centerXAnchor.constraint(equalTo: inputsContainerView.centerXAnchor).isActive = true
        nameContainerView.topAnchor.constraint(equalTo: inputsContainerView.topAnchor, constant: 50).isActive = true
        nameContainerView.widthAnchor.constraint(equalTo: inputsContainerView.widthAnchor, constant: -150).isActive = true
        nameContainerView.heightAnchor.constraint(equalToConstant: 50).isActive = true
        
        nameContainerView.addSubview(nameTextField)
        
        nameTextField.leftAnchor.constraint(equalTo: nameContainerView.leftAnchor, constant: 10).isActive = true
        
        nameTextField.topAnchor.constraint(equalTo: nameContainerView.topAnchor, constant: 15).isActive = true
        
        nameTextField.widthAnchor.constraint(equalTo: nameContainerView.widthAnchor).isActive = true
        
        
    }
    
    func setupInputsContainer() {
        //x, y, width, height
        inputsContainerView.centerXAnchor.constraint(equalTo: view.centerXAnchor).isActive = true
        inputsContainerView.centerYAnchor.constraint(equalTo: view.centerYAnchor).isActive = true
        inputsContainerView.widthAnchor.constraint(equalTo: view.widthAnchor, constant: -70).isActive = true
        inputsContainerView.heightAnchor.constraint(equalTo: view.heightAnchor, constant: -100).isActive = true
        
        //shadows
        inputsContainerView.layer.masksToBounds = false
        inputsContainerView.layer.shadowColor = UIColor.black.cgColor
        inputsContainerView.layer.shadowOpacity = 0.5
        inputsContainerView.layer.shadowRadius = 10
        inputsContainerView.layer.shadowOffset = CGSize.zero
        
        
        inputsContainerView.addSubview(dateTimePicker)
        inputsContainerView.addSubview(partySizePicker)
        inputsContainerView.addSubview(errorLabel)
        inputsContainerView.addSubview(partySizeLabel)
        inputsContainerView.addSubview(nameTextField)
        //inputsContainerView.addSubview(nameContainerView)
        
        setupDateTimePicker()
        setupPartySizeLabel()
        setupPartySizePicker()
        setupErrorLabel()
        setupNameTextField()
        //setupNameContainerView()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
    }
    
    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return partySizeArray.count
    }
    
    
    internal func pickerView(_ pickerView: UIPickerView, attributedTitleForRow row: Int, forComponent component: Int) -> NSAttributedString? {
        
        let rowString = NSAttributedString(string: String(partySizeArray[row]), attributes: [NSForegroundColorAttributeName : CustomColor.UCFGold])
        
        return rowString
    }
    
    func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        pickedPartySize = partySizeArray[row]
    }
    
    func pickerView(_ pickerView: UIPickerView, widthForComponent component: Int) -> CGFloat {
        return 100
    }
    func pickerView(_ pickerView: UIPickerView, rowHeightForComponent component: Int) -> CGFloat {
        return 20
    }

    func textFieldShouldReturn(_ textField: UITextField) -> Bool // called when 'return' key pressed. return false to ignore.
    {
        textField.resignFirstResponder()
        return true
    }
}

//Lucas's sexy ass animation (oh yas bby - Stephen)
extension UIView {
    func shake() {
        let animation = CAKeyframeAnimation(keyPath: "transform.translation.x")
        animation.timingFunction = CAMediaTimingFunction(name: kCAMediaTimingFunctionLinear)
        animation.duration = 0.6
        animation.values = [-20.0, 20.0, -20.0, 20.0, -10.0, 10.0, -5.0, 5.0, 0.0 ]
        layer.add(animation, forKey: "shake")
    }
}

