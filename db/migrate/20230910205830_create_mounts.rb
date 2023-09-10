class CreateMounts < ActiveRecord::Migration[6.1]
  def change
    create_table :mounts do |t|
      t.integer :mount_id
      t.string :name
      t.integer :display_id
      t.string :description
      t.string :source
      t.string :faction
      t.string :requirements

      t.timestamps
    end
  end
end
