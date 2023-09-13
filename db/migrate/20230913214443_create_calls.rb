class CreateCalls < ActiveRecord::Migration[6.1]
  def change
    create_table :calls do |t|

      t.timestamps
    end
  end
end
