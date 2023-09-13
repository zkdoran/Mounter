class DropMounts < ActiveRecord::Migration[6.1]
  def change
    drop_table :mounts
  end
end
