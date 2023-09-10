class CreateMounts < ActiveRecord::Migration[6.1]
  def change
    create_table :mounts do |t|

      t.timestamps
    end
  end
end
