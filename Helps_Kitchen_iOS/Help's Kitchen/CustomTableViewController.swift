//
//  CustomTableViewController.swift
//  Help's Kitchen
//
//  Created by Stephen Ulmer on 2/15/17.
//  Copyright © 2017 Stephen Ulmer. All rights reserved.
//

import UIKit

class CustomTableViewController: UITableViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        setupDesign()
    }
    
    func setupDesign() {
        view.backgroundColor = UIColor.black
        tableView.separatorColor = CustomColor.UCFGold
        tableView.backgroundColor = CustomColor.black
    }
    
    override func tableView(_ tableView: UITableView, willDisplayHeaderView view: UIView, forSection section: Int) {
        view.tintColor = CustomColor.UCFGold
        (view as! UITableViewHeaderFooterView).textLabel?.textColor = UIColor.black
    }

//    override func tableView(_ tableView: UITableView, willDisplay cell: UITableViewCell, forRowAt indexPath: IndexPath) {
//        cell.alpha = 0
//        
//        let rotationTransform = CATransform3DTranslate(CATransform3DIdentity, 500, 10, 0)
//        cell.layer.transform = rotationTransform
//        
//        UIView.animate(withDuration: 0.25){
//            cell.alpha = 1
//            cell.layer.transform = CATransform3DIdentity
//        }
//        
//    }
}
