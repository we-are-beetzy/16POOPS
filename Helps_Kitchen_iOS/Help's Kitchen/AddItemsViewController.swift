//
//  AddItemsViewController.swift
//  Help's Kitchen
//
//  Created by Stephen Ulmer on 2/13/17.
//  Copyright © 2017 Stephen Ulmer. All rights reserved.
//

import UIKit
import Firebase

class AddItemsViewController: UITableViewController {
    
    let ref = FIRDatabase.database().reference(fromURL: DataAccess.URL)

    override func viewDidLoad() {
        super.viewDidLoad()
        
        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Back", style: .plain, target: self, action: #selector(handleBack))

        // Do any additional setup after loading the view.
    }
    
    

    func handleBack() {
        dismiss(animated: true, completion: nil)
    }
    
}
