//
//  CustomTableCell.swift
//  Help's Kitchen
//
//  Created by Stephen Ulmer on 2/15/17.
//  Copyright © 2017 Stephen Ulmer. All rights reserved.
//

import UIKit

class CustomTableCell: UITableViewCell {
    
    let tableNameLabel: UILabel = {
        let tnl = UILabel()
        tnl.translatesAutoresizingMaskIntoConstraints = false
        tnl.backgroundColor = UIColor.black
        tnl.textColor = CustomColor.amber500
        
        return tnl
    }()

    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        
        self.tintColor = CustomColor.amber500
        self.backgroundColor = UIColor.black
    }
    

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        
        // Configure the view for the selected state
    }
    
    func setupTableNameLabel() {
        
    }

}
