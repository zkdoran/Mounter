class AddUserIdToSessions < ActiveRecord::Migration[6.1]
  def change
    add_belongs_to :sessions, :user
  end
end
