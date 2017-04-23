//
//  TableInfoViewController.swift
//  Help's Kitchen
//
//  Created by Stephen Ulmer on 2/23/17.
//  Copyright © 2017 Stephen Ulmer. All rights reserved.
//

import UIKit
import Firebase

class TableInfoViewController: UIViewController {
    
    let ref = FIRDatabase.database().reference(fromURL: "https://helps-kitchen.firebaseio.com/")
    
    var table: Table?

    override func viewDidLoad() {
        super.viewDidLoad()
        
        navigationItem.title = "Tables"
        self.navigationController!.navigationBar.titleTextAttributes = [NSForegroundColorAttributeName : CustomColor.amber500]
        
        navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Cancel", style: .plain, target: self, action: #selector(handleCancel))
        
        navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Ready", style: .plain, target: self, action: #selector(handleReady))
        // Do any additional setup after loading the view.
    }
    
    func handleCancel() {
        dismiss(animated: true, completion: nil)
    }
    
    func handleReady() {
        ref.child("tables").child((table?.key)!).child("tableStatus").setValue("available")
        dismiss(animated: true, completion: nil)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

}
